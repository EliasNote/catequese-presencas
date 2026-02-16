package models

type StatusPresenca string

const (
	StatusPresente    StatusPresenca = "presente"
	StatusFalta       StatusPresenca = "falta"
	StatusJustificada StatusPresenca = "justificada"
)

type Presenca struct {
	ID             uint           `json:"id" gorm:"primary_key"`
	EncontroId     uint           `json:"encontro_id"`
	CatequizandoId uint           `json:"catequizando_id"`
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