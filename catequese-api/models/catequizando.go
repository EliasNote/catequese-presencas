package models

type Catequizando struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Nome         string     `json:"nome"`
	CatequistaId uint       `json:"catequista_id"`
	Presencas    []Presenca `json:"presencas,omitempty"`
}

type CreateCatequizandoInput struct {
	Nome         string `json:"nome" binding:"required"`
	CatequistaId uint   `json:"catequista_id" binding:"required"`
}

type UpdateCatequizandoInput struct {
	Nome         string `json:"nome"`
	CatequistaId uint   `json:"catequista_id"`
}