package handlers

import (
	"catequese-api/models"
	"catequese-api/repositories"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PresencaHandler struct {
	repository *repositories.PresencaRepository
}

func NewPresencaHandler(repository *repositories.PresencaRepository) *PresencaHandler {
	return &PresencaHandler{repository: repository}
}

func (h *PresencaHandler) GetAll(c *gin.Context) {
	presencas, err := h.repository.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, presencas)
}

func (h *PresencaHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	presenca, err := h.repository.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Presença não encontrada"})
		return
	}
	c.JSON(http.StatusOK, presenca)
}

func (h *PresencaHandler) Create(c *gin.Context) {
	var input models.CreatePresencaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	presenca, err := h.repository.Create(&input)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, presenca)
}

func (h *PresencaHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var input models.UpdatePresencaInput
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

func (h *PresencaHandler) Delete(c *gin.Context) {
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
