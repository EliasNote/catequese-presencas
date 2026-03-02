package repositories

import (
	"catequese-api/models"
	"errors"

	"gorm.io/gorm"
)

type CatequizandoRepository struct {
	db *gorm.DB
}

func NewCatequizandoRepository(db *gorm.DB) *CatequizandoRepository {
	return &CatequizandoRepository{db: db}
}

func (r *CatequizandoRepository) FindAll() ([]models.Catequizando, error) {
	var catequizandos []models.Catequizando
	result := r.db.Preload("Catequista").Preload("Presencas").Find(&catequizandos)
	return catequizandos, result.Error
}

func (r *CatequizandoRepository) FindByID(id uint) (models.Catequizando, error) {
	var catequizando models.Catequizando
	result := r.db.Preload("Catequista").Preload("Presencas").First(&catequizando, id)
	return catequizando, result.Error
}

func (r *CatequizandoRepository) Create(input *models.CreateCatequizandoInput) (models.Catequizando, error) {
	catequizando := models.Catequizando{
		Nome:         input.Nome,
		CatequistaID: input.CatequistaID,
	}
	err := r.db.Create(&catequizando).Error
	if err != nil {
		return catequizando, err
	}

	return r.FindByID(catequizando.ID)
}

func (r *CatequizandoRepository) Update(id uint, input *models.UpdateCatequizandoInput) error {
	catequizando, err := r.FindByID(id)
	if err != nil {
		return errors.New("Catequizando não encontrado")
	}

	updates := map[string]interface{}{}

	if input.Nome != "" {
		updates["nome"] = input.Nome
	}
	if input.CatequistaID != 0 {
		updates["catequista_id"] = input.CatequistaID
	}

	return r.db.Model(&catequizando).Updates(updates).Error
}

func (r *CatequizandoRepository) Delete(id uint) error {
	return r.db.Delete(&models.Catequizando{}, id).Error
}
