package handlers

import (
	"catequese-api/auth"
	"catequese-api/models"
	"catequese-api/repositories"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	userRepo       *repositories.UserRepository
	catequistaRepo *repositories.CatequistaRepository
}

func NewAuthHandler(userRepo *repositories.UserRepository, catequistaRepo *repositories.CatequistaRepository) *AuthHandler {
	return &AuthHandler{userRepo: userRepo, catequistaRepo: catequistaRepo}
}

func (h *AuthHandler) Login(c *gin.Context) {
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
		catequista, err = h.catequistaRepo.FindByID(*user.CatequistaID)
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
