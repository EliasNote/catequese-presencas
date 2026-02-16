package models

import "time"

type Encontro struct {
	ID           uint `json:"id" gorm:"primary_key"`
	Data         time.Time `json:"data"`
	Tema         string `json:"tema"`
	Observacoes  string `json:"observacoes"`
	CatequistaId uint `json:"catequista_id"`
	Presencas []Presenca `json:"presencas,omitempty"`
}

type CreateEncontroInput struct {
    Data         string `json:"data" binding:"required"`
    Tema         string `json:"tema" binding:"required"`
    Observacoes  string `json:"observacoes"`
    CatequistaId uint   `json:"catequista_id" binding:"required"`
}

type UpdateEncontroInput struct {
    Data         string `json:"data"`
    Tema         string `json:"tema"`
    Observacoes  string `json:"observacoes"`
    CatequistaId uint   `json:"catequista_id"`
}