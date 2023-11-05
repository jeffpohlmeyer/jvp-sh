package models

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"time"
)

type UrlModelInterface interface {
	Insert(url string) (string, error)
	Get(url string) (Url, error)
}

type Url struct {
	ID        int       `json:"id"`
	URL       string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
	Redirect  string    `json:"redirect"`
	Version   int       `json:"version"`
}

type UrlModel struct {
	DB *sql.DB
}

func generateRandomHexString(length int) (string, error) {
	// Create a byte slice to store the random bytes
	randomBytes := make([]byte, length/2) // Each byte represents 2 hex characters

	// Read random data into the byte slice
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	// Convert the random bytes to a hexadecimal string
	hexString := hex.EncodeToString(randomBytes)

	return hexString, nil
}

func (m *UrlModel) Insert(url string) (string, error) {
	redirect, err := generateRandomHexString(8)
	if err != nil {
		return "", err
	}
	query := `INSERT INTO urls (url, redirect)
    	VALUES ($1, $2)`

	args := []any{url, redirect}

	_, err = m.DB.Exec(query, args...)
	if err != nil {
		return "", err
	}

	return redirect, nil
}

func (m *UrlModel) Get(url string) (Url, error) {
	// Write the SQL statement we want to execute.
	query := `SELECT id, url, created_at, redirect, version
		FROM urls
		WHERE url = $1`

	args := []any{url}

	// Use the QueryRow() method on the connection pool to execute our
	// SQL statement, passing in the untrusted id variable as the value for the
	// placeholder parameter. This returns a pointer to a sql.Row object which
	// holds the result from the database.
	row := m.DB.QueryRow(query, args...)

	// Initialize a new zeroed url struct
	var u Url

	// Use row.Scan() to copy the values from each field in sql.Row to the
	// corresponding field in the Snippet struct. Notice that the arguments
	// to row.Scan are *pointers* to the place you want to copy the data into,
	// and the number of arguments must be exactly the same as the number of
	// columns returned by your statement.
	err := row.Scan(&u.ID, &u.URL, &u.CreatedAt, &u.Redirect, &u.Version)
	if err != nil {
		// If the query returns no rows, then row.Scan() will return a
		// sql.ErrNoRows error. We use the errors.Is() function check for that
		// error specifically, and return our own ErrNoRecord error
		// instead (we'll create this in a moment).
		if errors.Is(err, sql.ErrNoRows) {
			return Url{}, ErrRecordNotFound
		} else {
			return Url{}, err
		}
	}
	// If everything went OK, then return the filled url struct
	return u, nil
}
