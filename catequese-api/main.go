package main

import (
	"catequese-api/config"
	"catequese-api/routes"
	"os"
)

func main() {
	db := config.ConnectDatabase()
	r := routes.SetupRoutes(db)
	port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    r.Run(":" + port) 
}
