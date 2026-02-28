package models

import "time"

type Encontro struct {
	ID           uint       `json:"id" gorm:"primary_key"`
	Data         time.Time  `json:"data"`
	Tema         string     `json:"tema"`
	Observacoes  string     `json:"observacoes"`
	CatequistaId uint        `json:"-"`
	Catequista   *Catequista `json:"catequista,omitempty"`
	Presencas    []Presenca `json:"presencas"`
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

type EncontroResponse struct {
	ID          uint               `json:"id"`
	Data        time.Time          `json:"data"`
	Tema        string             `json:"tema"`
	Observacoes string             `json:"observacoes"`
	Catequista  *Catequista        `json:"catequista,omitempty"`
	Presencas   []PresencaResponse `json:"presencas"`
}

func (e Encontro) ToResponse() EncontroResponse {
	resp := EncontroResponse{
		ID:          e.ID,
		Data:        e.Data,
		Tema:        e.Tema,
		Observacoes: e.Observacoes,
		Catequista:  e.Catequista,
	}
	for _, p := range e.Presencas {
		resp.Presencas = append(resp.Presencas, p.ToResponse())
	}
	return resp
}