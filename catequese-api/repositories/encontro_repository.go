package repositories

import (
	"catequese-api/models"
	"errors"
	"time"

	"gorm.io/gorm"
)

type EncontroRepository struct {
	db *gorm.DB
}

func NewEncontroRepository(db *gorm.DB) *EncontroRepository {
	return &EncontroRepository{db: db}
}

func (r *EncontroRepository) FindAll() ([]models.Encontro, error) {
	var encontros []models.Encontro
	result := r.db.Find(&encontros)
	return encontros, result.Error
}

func (r *EncontroRepository) FindByID(id uint) (models.Encontro, error) {
	var encontro models.Encontro
	result := r.db.First(&encontro, id)
	return encontro, result.Error
}

func (r *EncontroRepository) Create(input *models.CreateEncontroInput) (models.Encontro, error) {
	data, err := parseEncontroData(input.Data)
	if err != nil {
		return models.Encontro{}, errors.New("Data inválida. Use YYYY-MM-DD ou RFC3339")
	}

	encontro := models.Encontro{
		Data:         data,
		Tema:         input.Tema,
		Observacoes:  input.Observacoes,
		CatequistaId: input.CatequistaId,
	}

	err = r.db.Create(&encontro).Error
	return encontro, err
}

func (r *EncontroRepository) Update(id uint, input *models.UpdateEncontroInput) error {
	encontro, err := r.FindByID(id)
	if err != nil {
		return errors.New("Encontro não encontrado")
	}

	if input.Data != "" {
		data, parseErr := parseEncontroData(input.Data)
		if parseErr != nil {
			return errors.New("Data inválida. Use YYYY-MM-DD ou RFC3339")
		}
		encontro.Data = data
	}
	if input.Tema != "" {
		encontro.Tema = input.Tema
	}
	encontro.Observacoes = input.Observacoes
	if input.CatequistaId != 0 {
		encontro.CatequistaId = input.CatequistaId
	}

	return r.db.Save(&encontro).Error
}

func (r *EncontroRepository) Delete(id uint) error {
	return r.db.Delete(&models.Encontro{}, id).Error
}

func parseEncontroData(value string) (time.Time, error) {
	if value == "" {
		return time.Time{}, errors.New("data vazia")
	}

	if dateOnly, err := time.Parse("2006-01-02", value); err == nil {
		return dateOnly, nil
	}

	return time.Parse(time.RFC3339, value)
}
