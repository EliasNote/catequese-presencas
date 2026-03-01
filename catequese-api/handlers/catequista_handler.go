package handlers

import (
	"catequese-api/auth"
	"catequese-api/models"
	"catequese-api/repositories"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CatequistaHandler struct {
	repository *repositories.CatequistaRepository
    userRepo   *repositories.UserRepository
}

func NewCatequistaHandler(repository *repositories.CatequistaRepository, userRepo *repositories.UserRepository) *CatequistaHandler {
    return &CatequistaHandler{repository: repository, userRepo: userRepo}
}

func (h *CatequistaHandler) GetAll(c *gin.Context) {
	catequistas, err := h.repository.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, catequistas)
}

func (h *CatequistaHandler) GetByID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return
    }

    user, err := h.repository.FindByID(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
        return
    }
    c.JSON(http.StatusOK, user)
}

func (h *CatequistaHandler) Create(c *gin.Context) {
    var input models.CreateCatequistaInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    catequista, err := h.repository.Create(&input)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, catequista)
}

func (h *CatequistaHandler) Update(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
        return
    }

    var input models.UpdateCatequistaInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err = h.repository.Update(uint(id), &input)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.Status(http.StatusOK)
}

func (h *CatequistaHandler) Delete(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
        return
    }

    if err := h.repository.Delete(uint(id)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusNoContent, nil)
}

func (h *CatequistaHandler) Login(c *gin.Context) {
	var input models.LoginCatequistaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    login := input.Login
    if login == "" {
        login = input.Nome
    }

    user, err := h.userRepo.FindByCredentials(login, input.Senha)
	if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Login ou senha inválidos"})
		return
	}

    catequista := models.Catequista{}
    if user.CatequistaID != nil {
        catequista, err = h.repository.FindByID(*user.CatequistaID)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário sem catequista válido"})
            return
        }
    }

    nomeToken := user.Login
    if catequista.ID != 0 {
        nomeToken = catequista.Nome
    }

    token, err := auth.GenerateToken(user, nomeToken)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
        return
    }

    c.JSON(http.StatusOK, models.LoginCatequistaResponse{
        Token:      token,
        Role:       user.Role,
        Catequista: catequista,
    })
}