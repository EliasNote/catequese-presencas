package routes

import (
	"catequese-api/handlers"
	"catequese-api/middlewares"
	"catequese-api/models"
	"catequese-api/repositories"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	comunidadeRepo := repositories.NewComunidadeRepository(db)
	comunidadeHandler := handlers.NewComunidadeHandler(comunidadeRepo)
	userRepo := repositories.NewUserRepository(db)
	catequistaRepo := repositories.NewCatequistaRepository(db, userRepo)
	catequistaHandler := handlers.NewCatequistaHandler(catequistaRepo)
	authHandler := handlers.NewAuthHandler(userRepo, catequistaRepo)
	catequizandoRepo := repositories.NewCatequizandoRepository(db)
	catequizandoHandler := handlers.NewCatequizandoHandler(catequizandoRepo)
	encontroRepo := repositories.NewEncontroRepository(db)
	encontroHandler := handlers.NewEncontroHandler(encontroRepo)
	presencaRepo := repositories.NewPresencaRepository(db)
	presencaHandler := handlers.NewPresencaHandler(presencaRepo)

	api := r.Group("/api")
	{
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/login", authHandler.Login)
		}

		protected := api.Group("")
		protected.Use(middlewares.JWTAuthMiddleware())
		protected.Use(middlewares.RequireRoles(models.RoleAdmin, models.RoleCatequista))
		adminOnly := protected.Group("")
		adminOnly.Use(middlewares.AdminOnlyMiddleware())
		catequistaAccess := protected.Group("")
		catequistaAccess.Use(middlewares.RequireRoles(models.RoleCatequista, models.RoleAdmin))

		comunidades := protected.Group("/comunidades")
		{
			comunidades.GET("", comunidadeHandler.GetAll)
			comunidades.GET("/:id", comunidadeHandler.GetByID)
		}

		comunidadesAdmin := adminOnly.Group("/comunidades")
		{
			comunidadesAdmin.POST("", comunidadeHandler.Create)
			comunidadesAdmin.PUT("/:id", comunidadeHandler.Update)
			comunidadesAdmin.DELETE("/:id", comunidadeHandler.Delete)
		}

		catequistas := protected.Group("/catequistas")
		{
			catequistas.GET("", catequistaHandler.GetAll)
			catequistas.GET("/:id", catequistaHandler.GetByID)
		}

		catequistasAdmin := adminOnly.Group("/catequistas")
		{
			catequistasAdmin.POST("", catequistaHandler.Create)
			catequistasAdmin.PUT("/:id", catequistaHandler.Update)
			catequistasAdmin.DELETE("/:id", catequistaHandler.Delete)
		}

		catequizandos := catequistaAccess.Group("/catequizandos")
		{
			catequizandos.GET("", catequizandoHandler.GetAll)
			catequizandos.GET("/:id", catequizandoHandler.GetByID)
			catequizandos.POST("", catequizandoHandler.Create)
			catequizandos.PUT("/:id", catequizandoHandler.Update)
			catequizandos.DELETE("/:id", catequizandoHandler.Delete)
		}

		encontros := catequistaAccess.Group("/encontros")
		{
			encontros.GET("", encontroHandler.GetAll)
			encontros.GET("/:id", encontroHandler.GetByID)
			encontros.POST("", encontroHandler.Create)
			encontros.PUT("/:id", encontroHandler.Update)
			encontros.DELETE("/:id", encontroHandler.Delete)
		}

		presencas := catequistaAccess.Group("/presencas")
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
