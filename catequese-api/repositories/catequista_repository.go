package repositories

import (
	"catequese-api/models"
	"errors"

	"gorm.io/gorm"
)

type CatequistaRepository struct {
	db *gorm.DB
}

func NewCatequistaRepository(db *gorm.DB) *CatequistaRepository {
	return &CatequistaRepository{db: db}
}

func (r *CatequistaRepository) FindAll() ([]models.Catequista, error) {
	var catequistas []models.Catequista
	result := r.db.Preload("Comunidade").Preload("Catequizandos").Preload("Encontros").Find(&catequistas)
	return catequistas, result.Error
}

func (r *CatequistaRepository) FindByID(id uint) (models.Catequista, error) {
	var catequista models.Catequista
	result := r.db.Preload("Comunidade").Preload("Catequizandos").Preload("Encontros").First(&catequista, id)
	return catequista, result.Error
}

func (r *CatequistaRepository) Create(input *models.CreateCatequistaInput) (models.Catequista, error) {
	catequista := models.Catequista{
		Nome:         input.Nome,
		Senha:        input.Senha,
		ComunidadeID: input.ComunidadeID,
	}
	err := r.db.Create(&catequista).Error
	if err != nil {
		return catequista, err
	}

	return r.FindByID(catequista.ID)
}

func (r *CatequistaRepository) Update(id uint, input *models.UpdateCatequistaInput) error {
	catequista, err := r.FindByID(id)
	if err != nil {
		return errors.New("Catequista não encontrado")
	}
	if input.Nome != "" {
		catequista.Nome = input.Nome
	}
	if input.Senha != "" {
		catequista.Senha = input.Senha
	}
	if input.ComunidadeID != 0 {
		catequista.ComunidadeID = input.ComunidadeID
	}
	return r.db.Save(&catequista).Error
}

func (r *CatequistaRepository) Delete(id uint) error {
    return r.db.Delete(&models.Catequista{}, id).Error
}

func (r *CatequistaRepository) FindByCredentials(nome, senha string) (models.Catequista, error) {
	var catequista models.Catequista
	result := r.db.Where("nome = ? AND senha = ?", nome, senha).First(&catequista)
	return catequista, result.Error
}