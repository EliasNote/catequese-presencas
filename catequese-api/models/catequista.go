package models

type Catequista struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Nome string `json:"nome"`
	// Comunidade
	Catequizandos []Catequizando `json:"catequizandos,omitempty"`
	Encontros     []Encontro     `json:"encontros,omitempty"`
}

type CreateCatequistaInput struct {
	Nome string `json:"nome" binding:"required"`
}

type UpdateCatequistaInput struct {
	Nome string `json:"nome"`
}