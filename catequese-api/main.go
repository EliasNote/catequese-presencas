package main

import (
	"catequese-api/config"
	"catequese-api/routes"
)

func main() {
	db := config.ConnectDatabase()
	r := routes.SetupRoutes(db)
	r.Run(":8080")
}
