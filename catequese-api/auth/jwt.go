package auth

import (
	"catequese-api/models"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID       uint  `json:"user_id"`
	Role         string `json:"role"`
	CatequistaID *uint  `json:"catequista_id,omitempty"`
	Nome         string `json:"nome"`
	jwt.RegisteredClaims
}

func GenerateToken(user models.User, nome string) (string, error) {
	secret := getJWTSecret()

	claims := Claims{
		UserID:       user.ID,
		Role:         user.Role,
		CatequistaID: user.CatequistaID,
		Nome:         nome,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ParseToken(tokenString string) (*Claims, error) {
	secret := getJWTSecret()

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de assinatura inválido")
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("token inválido")
	}

	return claims, nil
}

func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "troque-essa-chave-em-producao"
	}
	return secret
}
