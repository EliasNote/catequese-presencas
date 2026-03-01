package models

type Catequista struct {
	ID            uint           `json:"id" gorm:"primary_key"`
	Nome		  string         `json:"nome"`
	Senha		  string         `json:"-"`
	ComunidadeID  uint           `json:"-"`
	Comunidade    *Comunidade    `json:"comunidade,omitempty"`
	Catequizandos []Catequizando `json:"catequizandos"`
	Encontros     []Encontro     `json:"encontros"`
}

type CreateCatequistaInput struct {
	Nome         string `json:"nome" binding:"required"`
	Login        string `json:"login"`
	Senha        string `json:"senha" binding:"required"`
	ComunidadeID uint   `json:"comunidade_id"`
}

type LoginCatequistaInput struct {
	Login string `json:"login" binding:"required_without=Nome"`
	Nome  string `json:"nome" binding:"required_without=Login"`
	Senha string `json:"senha" binding:"required"`
}

type LoginCatequistaResponse struct {
	Token      string     `json:"token"`
	Role       string     `json:"role"`
	Catequista Catequista `json:"catequista"`
}

type UpdateCatequistaInput struct {
	Nome         string `json:"nome"`
	Login        string `json:"login"`
	Senha        string `json:"senha"`
	ComunidadeID uint   `json:"comunidade_id"`
}

type CatequistaResponse struct {
	ID            uint                   `json:"id"`
	Nome          string                 `json:"nome"`
	Catequizandos []CatequizandoResponse `json:"catequizandos"`
	Encontros     []EncontroResponse     `json:"encontros"`
}

func (c Catequista) ToResponse() CatequistaResponse {
	resp := CatequistaResponse{
		ID:   c.ID,
		Nome: c.Nome,
	}
	for _, cz := range c.Catequizandos {
		resp.Catequizandos = append(resp.Catequizandos, cz.ToResponse())
	}
	for _, e := range c.Encontros {
		resp.Encontros = append(resp.Encontros, e.ToResponse())
	}
	return resp
}