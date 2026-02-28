package routes

import (
	"catequese-api/handlers"
	"catequese-api/middlewares"
	"catequese-api/repositories"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	comunidadeRepo := repositories.NewComunidadeRepository(db)
	comunidadeHandler := handlers.NewComunidadeHandler(comunidadeRepo)
	catequistaRepo := repositories.NewCatequistaRepository(db)
	catequistaHandler := handlers.NewCatequistaHandler(catequistaRepo)
	catequizandoRepo := repositories.NewCatequizandoRepository(db)
	catequizandoHandler := handlers.NewCatequizandoHandler(catequizandoRepo)
	encontroRepo := repositories.NewEncontroRepository(db)
	encontroHandler := handlers.NewEncontroHandler(encontroRepo)
	presencaRepo := repositories.NewPresencaRepository(db)
	presencaHandler := handlers.NewPresencaHandler(presencaRepo)

	api := r.Group("/api")
	{
		catequistasPublic := api.Group("/catequistas")
		{
			catequistasPublic.POST("/login", catequistaHandler.Login)
		}

		protected := api.Group("")
		protected.Use(middlewares.JWTAuthMiddleware())

		comunidades := protected.Group("/comunidades")
		{
			comunidades.GET("", comunidadeHandler.GetAll)
			comunidades.GET("/:id", comunidadeHandler.GetByID)
			comunidades.POST("", comunidadeHandler.Create)
			comunidades.PUT("/:id", comunidadeHandler.Update)
			comunidades.DELETE("/:id", comunidadeHandler.Delete)
		}

		catequistas := protected.Group("/catequistas")
		{
			catequistas.GET("", catequistaHandler.GetAll)
			catequistas.GET("/:id", catequistaHandler.GetByID)
			catequistas.POST("", catequistaHandler.Create)
			catequistas.PUT("/:id", catequistaHandler.Update)
			catequistas.DELETE("/:id", catequistaHandler.Delete)
		}

		catequizandos := protected.Group("/catequizandos")
		{
			catequizandos.GET("", catequizandoHandler.GetAll)
			catequizandos.GET("/:id", catequizandoHandler.GetByID)
			catequizandos.POST("", catequizandoHandler.Create)
			catequizandos.PUT("/:id", catequizandoHandler.Update)
			catequizandos.DELETE("/:id", catequizandoHandler.Delete)
		}

		encontros := protected.Group("/encontros")
		{
			encontros.GET("", encontroHandler.GetAll)
			encontros.GET("/:id", encontroHandler.GetByID)
			encontros.POST("", encontroHandler.Create)
			encontros.PUT("/:id", encontroHandler.Update)
			encontros.DELETE("/:id", encontroHandler.Delete)
		}

		presencas := protected.Group("/presencas")
		{
			presencas.GET("", presencaHandler.GetAll)
			presencas.GET("/:id", presencaHandler.GetByID)
			presencas.POST("", presencaHandler.Create)
			presencas.PUT("/:id", presencaHandler.Update)
			presencas.DELETE("/:id", presencaHandler.Delete)
		}
	}

	return r
}