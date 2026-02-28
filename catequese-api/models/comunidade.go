package models

type Comunidade struct {
	ID          uint         `json:"id" gorm:"primaryKey"`
	Nome        string       `json:"nome"`
	Catequistas []Catequista `json:"catequistas"`
}

type CreateComunidadeInput struct {
	Nome string `json:"nome" binding:"required"`
}

type UpdateComunidadeInput struct {
	Nome string `json:"nome"`
}

type ComunidadeResponse struct {
	ID          uint                 `json:"id"`
	Nome        string               `json:"nome"`
	Catequistas []CatequistaResponse `json:"catequistas"`
}

func (c Comunidade) ToResponse() ComunidadeResponse {
	resp := ComunidadeResponse{
		ID:   c.ID,
		Nome: c.Nome,
	}
	return resp
}