package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequireRoles(roles ...string) gin.HandlerFunc {
	allowedRoles := make(map[string]struct{}, len(roles))
	for _, role := range roles {
		allowedRoles[role] = struct{}{}
	}

	return func(c *gin.Context) {
		value, exists := c.Get("role")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
			return
		}

		role, ok := value.(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
			return
		}

		if _, allowed := allowedRoles[role]; !allowed {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado para este perfil"})
			return
		}

		c.Next()
	}
}
