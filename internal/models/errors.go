package models

import "errors"

var (
	ErrRecordNotFound = errors.New("models: no matching record found")
	//ErrEditConflict   = errors.New("edit conflict")
)
