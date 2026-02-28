package config

import (
	"catequese-api/models"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDatabase() *gorm.DB {
    dsn := "root:root@tcp(localhost:3306)/catedral?charset=utf8mb4&parseTime=True&loc=Local"

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Falha ao conectar no banco:", err)
    }
    
    db.AutoMigrate(
				&models.Comunidade{},
		&models.Catequizando{},
		&models.Encontro{},
		&models.Presenca{},
	)

    return db
}