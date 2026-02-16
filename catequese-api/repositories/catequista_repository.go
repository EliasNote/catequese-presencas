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
	result := r.db.Find(&catequistas)
	return catequistas, result.Error
}

func (r *CatequistaRepository) FindByID(id uint) (models.Catequista, error) {
    var catequista models.Catequista
    result := r.db.First(&catequista, id)
    return catequista, result.Error
}

func (r *CatequistaRepository) Create(input *models.CreateCatequistaInput) (models.Catequista, error) {
	catequista := models.Catequista{
		Nome: input.Nome,
	}
	err := r.db.Create(&catequista).Error
	return catequista, err
}

func (r *CatequistaRepository) Update(id uint, input *models.UpdateCatequistaInput) error {
	catequista, err := r.FindByID(id)
	if err != nil {
        return errors.New("Catequista não encontrado")
    }
	catequista.Nome = input.Nome
    return r.db.Save(&catequista).Error
}

func (r *CatequistaRepository) Delete(id uint) error {
    return r.db.Delete(&models.Catequista{}, id).Error
}