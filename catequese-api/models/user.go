package models

const (
	RoleAdmin      = "admin"
	RoleCatequista = "catequista"
)

type User struct {
	ID           uint        `json:"id" gorm:"primaryKey"`
	Login        string      `json:"login" gorm:"uniqueIndex;not null"`
	Senha        string      `json:"-" gorm:"not null"`
	Role         string      `json:"role" gorm:"type:varchar(20);not null;default:'catequista'"`
	Ativo        bool        `json:"ativo" gorm:"not null;default:true"`
	CatequistaID *uint       `json:"catequista_id"`
	Catequista   *Catequista `json:"catequista,omitempty"`
}