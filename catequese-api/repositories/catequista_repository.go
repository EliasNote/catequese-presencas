package repositories

import (
	"catequese-api/models"
	"errors"

	"gorm.io/gorm"
)

type CatequistaRepository struct {
	db       *gorm.DB
	userRepo *UserRepository
}

func NewCatequistaRepository(db *gorm.DB, userRepo *UserRepository) *CatequistaRepository {
	return &CatequistaRepository{db: db, userRepo: userRepo}
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

	login := input.Login
	if login == "" {
		login = input.Nome
	}

	user := models.User{
		Login:        login,
		Senha:        input.Senha,
		Role:         models.RoleCatequista,
		Ativo:        true,
		CatequistaID: &catequista.ID,
	}

	if err := r.userRepo.Create(&user); err != nil {
		_ = r.db.Delete(&models.Catequista{}, catequista.ID).Error
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

	if err := r.db.Save(&catequista).Error; err != nil {
		return err
	}

	user, err := r.userRepo.FindByCatequistaID(id)
	if err != nil {
		login := input.Login
		if login == "" {
			if input.Nome != "" {
				login = input.Nome
			} else {
				login = catequista.Nome
			}
		}

		senha := input.Senha
		if senha == "" {
			senha = catequista.Senha
		}

		newUser := models.User{
			Login:        login,
			Senha:        senha,
			Role:         models.RoleCatequista,
			Ativo:        true,
			CatequistaID: &catequista.ID,
		}
		return r.userRepo.Create(&newUser)
	}

	if input.Login != "" {
		user.Login = input.Login
	} else if input.Nome != "" {
		user.Login = input.Nome
	}
	if input.Senha != "" {
		user.Senha = input.Senha
	}

	return r.userRepo.Update(&user)
}

func (r *CatequistaRepository) Delete(id uint) error {
	if err := r.userRepo.DeleteByCatequistaID(id); err != nil {
		return err
	}
	return r.db.Delete(&models.Catequista{}, id).Error
}