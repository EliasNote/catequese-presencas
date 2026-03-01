package config

import (
	"catequese-api/models"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDatabase() *gorm.DB {
	_ = godotenv.Load()

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require TimeZone=America/Sao_Paulo", dbHost, dbUser, dbPassword, dbName, dbPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Falha ao conectar no banco:", err)
	}

	db.AutoMigrate(
		&models.Comunidade{},
		&models.Catequista{},
		&models.Catequizando{},
		&models.Encontro{},
		&models.Presenca{},
		&models.User{},
	)

	ensureUsersFromCatequistas(db)

	return db
}

func ensureUsersFromCatequistas(db *gorm.DB) {
	var catequistas []models.Catequista
	if err := db.Find(&catequistas).Error; err != nil {
		return
	}

	for _, catequista := range catequistas {
		var existing models.User
		err := db.Where("catequista_id = ?", catequista.ID).First(&existing).Error
		if err == nil {
			continue
		}
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			continue
		}

		login := catequista.Nome
		if login == "" {
			login = fmt.Sprintf("catequista_%d", catequista.ID)
		}

		user := models.User{
			Login:        login,
			Senha:        catequista.Senha,
			Role:         models.RoleCatequista,
			Ativo:        true,
			CatequistaID: &catequista.ID,
		}

		if createErr := db.Create(&user).Error; createErr != nil {
			fallback := models.User{
				Login:        fmt.Sprintf("catequista_%d", catequista.ID),
				Senha:        catequista.Senha,
				Role:         models.RoleCatequista,
				Ativo:        true,
				CatequistaID: &catequista.ID,
			}
			_ = db.Create(&fallback).Error
		}
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
