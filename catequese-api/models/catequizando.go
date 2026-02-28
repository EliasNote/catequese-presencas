package models

type Catequizando struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Nome         string     `json:"nome"`
	CatequistaID uint        `json:"-"`
	Catequista   *Catequista `json:"catequista,omitempty"`
	Presencas    []Presenca `json:"presencas"`
}

type CreateCatequizandoInput struct {
	Nome         string `json:"nome" binding:"required"`
	CatequistaID uint   `json:"catequista_id" binding:"required"`
}

type UpdateCatequizandoInput struct {
	Nome         string `json:"nome"`
	CatequistaID uint   `json:"catequista_id"`
}

type CatequizandoResponse struct {
	ID           uint               `json:"id"`
	Nome         string             `json:"nome"`
	Catequista   *Catequista        `json:"catequista,omitempty"`
	Presencas    []PresencaResponse `json:"presencas"`
}

func (c Catequizando) ToResponse() CatequizandoResponse {
	resp := CatequizandoResponse{
		ID:           c.ID,
		Nome:         c.Nome,
		Catequista:   c.Catequista,
	}
	for _, p := range c.Presencas {
		resp.Presencas = append(resp.Presencas, p.ToResponse())
	}
	return resp
}