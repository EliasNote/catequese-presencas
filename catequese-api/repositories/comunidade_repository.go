package repositories

import (
	"catequese-api/models"
	"errors"

	"gorm.io/gorm"
)

type ComunidadeRepository struct {
	db *gorm.DB
}

func NewComunidadeRepository(db *gorm.DB) *ComunidadeRepository {
	return &ComunidadeRepository{db: db}
}

func (r *ComunidadeRepository) FindAll() ([]models.Comunidade, error) {
	var comunidades []models.Comunidade
	result := r.db.Preload("Catequistas").Find(&comunidades)
	return comunidades, result.Error
}

func (r *ComunidadeRepository) FindByID(id uint) (models.Comunidade, error) {
	var comunidade models.Comunidade
	result := r.db.Preload("Catequistas").First(&comunidade, id)
	return comunidade, result.Error
}

func (r *ComunidadeRepository) Create(input *models.CreateComunidadeInput) (models.Comunidade, error) {
	comunidade := models.Comunidade{
		Nome: input.Nome,
	}
	err := r.db.Create(&comunidade).Error
	if err != nil {
		return comunidade, err
	}

	return r.FindByID(comunidade.ID)
}

func (r *ComunidadeRepository) Update(id uint, input *models.UpdateComunidadeInput) error {
	comunidade, err := r.FindByID(id)
	if err != nil {
		return errors.New("Comunidade não encontrada")
	}
	if input.Nome != "" {
		comunidade.Nome = input.Nome
	}
	return r.db.Save(&comunidade).Error
}

func (r *ComunidadeRepository) Delete(id uint) error {
	return r.db.Delete(&models.Comunidade{}, id).Error
}
