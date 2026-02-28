package repositories

import (
	"catequese-api/models"
	"errors"

	"gorm.io/gorm"
)

type PresencaRepository struct {
	db *gorm.DB
}

func NewPresencaRepository(db *gorm.DB) *PresencaRepository {
	return &PresencaRepository{db: db}
}

func (r *PresencaRepository) FindAll() ([]models.Presenca, error) {
	var presencas []models.Presenca
	result := r.db.Preload("Encontro").Preload("Catequizando").Find(&presencas)
	return presencas, result.Error
}

func (r *PresencaRepository) FindByID(id uint) (models.Presenca, error) {
	var presenca models.Presenca
	result := r.db.Preload("Encontro").Preload("Catequizando").First(&presenca, id)
	return presenca, result.Error
}

func (r *PresencaRepository) Create(input *models.CreatePresencaInput) (models.Presenca, error) {
	presenca := models.Presenca{
		EncontroId:     input.EncontroId,
		CatequizandoId: input.CatequizandoId,
		Status:         input.Status,
	}

	err := r.db.Create(&presenca).Error
	if err != nil {
		return presenca, err
	}

	return r.FindByID(presenca.ID)
}

func (r *PresencaRepository) Update(id uint, input *models.UpdatePresencaInput) error {
	presenca, err := r.FindByID(id)
	if err != nil {
		return errors.New("Presença não encontrada")
	}

	presenca.Status = input.Status
	return r.db.Save(&presenca).Error
}

func (r *PresencaRepository) Delete(id uint) error {
	return r.db.Delete(&models.Presenca{}, id).Error
}
