package middlewares

import (
	"catequese-api/auth"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token não informado"})
			return
		}

		tokenParts := strings.SplitN(authHeader, " ", 2)
		if len(tokenParts) != 2 || strings.ToLower(tokenParts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Formato de token inválido"})
			return
		}

		claims, err := auth.ParseToken(tokenParts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido ou expirado"})
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("role", claims.Role)
		if claims.CatequistaID != nil {
			c.Set("catequista_id", *claims.CatequistaID)
		}
		c.Set("catequista_nome", claims.Nome)
		c.Next()
	}
}
