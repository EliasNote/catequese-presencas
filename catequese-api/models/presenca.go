package models

type StatusPresenca string

const (
	StatusPresente    StatusPresenca = "presente"
	StatusFalta       StatusPresenca = "falta"
	StatusJustificada StatusPresenca = "justificada"
)

type Presenca struct {
	ID             uint           `json:"id" gorm:"primary_key"`
	EncontroId     uint           `json:"-"`
	Encontro       *Encontro      `json:"encontro,omitempty"`
	CatequizandoId uint           `json:"-"`
	Catequizando   *Catequizando  `json:"catequizando,omitempty"`
	Status         StatusPresenca `json:"status"`
}

type CreatePresencaInput struct {
	EncontroId     uint           `json:"encontro_id" binding:"required"`
	CatequizandoId uint           `json:"catequizando_id" binding:"required"`
	Status         StatusPresenca `json:"status" binding:"required,oneof=presente falta justificada"`
}

type UpdatePresencaInput struct {
	Status StatusPresenca `json:"status" binding:"required,oneof=presente falta justificada"`
}

type PresencaResponse struct {
	ID           uint           `json:"id"`
	Encontro     *Encontro      `json:"encontro,omitempty"`
	Catequizando *Catequizando  `json:"catequizando,omitempty"`
	Status       StatusPresenca `json:"status"`
}

func (p Presenca) ToResponse() PresencaResponse {
	return PresencaResponse{
		ID:           p.ID,
		Encontro:     p.Encontro,
		Catequizando: p.Catequizando,
		Status:       p.Status,
	}
}