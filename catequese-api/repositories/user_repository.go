package repositories

import (
	"catequese-api/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindByCredentials(login, senha string) (models.User, error) {
	var user models.User
	result := r.db.Where("login = ? AND senha = ? AND ativo = ?", login, senha, true).First(&user)
	return user, result.Error
}

func (r *UserRepository) FindByCatequistaID(catequistaID uint) (models.User, error) {
	var user models.User
	result := r.db.Where("catequista_id = ?", catequistaID).First(&user)
	return user, result.Error
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) DeleteByCatequistaID(catequistaID uint) error {
	return r.db.Where("catequista_id = ?", catequistaID).Delete(&models.User{}).Error
}
