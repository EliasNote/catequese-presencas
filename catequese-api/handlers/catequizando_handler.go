package handlers

import (
	"catequese-api/models"
	"catequese-api/repositories"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CatequizandoHandler struct {
	repository *repositories.CatequizandoRepository
}

func NewCatequizandoHandler(repository *repositories.CatequizandoRepository) *CatequizandoHandler {
	return &CatequizandoHandler{repository: repository}
}

func (h *CatequizandoHandler) GetAll(c *gin.Context) {
	catequizandos, err := h.repository.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, catequizandos)
}

func (h *CatequizandoHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	catequizando, err := h.repository.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Catequizando não encontrado"})
		return
	}
	c.JSON(http.StatusOK, catequizando)
}

func (h *CatequizandoHandler) Create(c *gin.Context) {
	var input models.CreateCatequizandoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	catequizando, err := h.repository.Create(&input)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, catequizando)
}

func (h *CatequizandoHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var input models.UpdateCatequizandoInput
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

func (h *CatequizandoHandler) Delete(c *gin.Context) {
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
