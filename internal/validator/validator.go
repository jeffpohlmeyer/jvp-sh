package validator

import (
	"regexp"
	"slices"
	"strings"
)

// Define a new Validator struct which contains a map of validation error messages for our form fields
type Validator struct {
	FieldErrors map[string]string
}

// Valid() returns true if the FieldErrors map doesn't contain any entries
func (v *Validator) Valid() bool {
	return len(v.FieldErrors) == 0
}

// AddFieldError() adds an error message to the FieldErrors map (so long as no entry already exists for the given key)
func (v *Validator) AddFieldError(key, message string) {
	// Note: we need to initialize the map first, if it isn't already initialized
	if v.FieldErrors == nil {
		v.FieldErrors = make(map[string]string)
	}

	if _, exists := v.FieldErrors[key]; !exists {
		v.FieldErrors[key] = message
	}
}

// CheckField() adds an error message to the FieldErrors map only if a validation check is not 'ok'
func (v *Validator) CheckField(ok bool, key, message string) {
	if !ok {
		v.AddFieldError(key, message)
	}
}

// NotBlank() returns tru if a value is not an empty string
func NotBlank(value string) bool {
	return strings.TrimSpace(value) != ""
}

// MaxChars( )returns tru if a value contains no more than n characters
func MaxChars(value string, n int) bool {
	return len(value) <= n
}

// PermittedValue() returns true if a value is in a list of specific permitted values
func PermittedValue[T comparable](value T, permittedValues ...T) bool {
	return slices.Contains(permittedValues, value)
}

// CheckRegex() returns true if a value passes a given regex check
func CheckRegex(value string, regexPattern string) bool {
	// Compile the regular expression pattern
	regex, err := regexp.Compile(regexPattern)
	if err != nil {
		return false // Invalid regular expression
	}

	// Use the MatchString method to check if the value matches the pattern
	return regex.MatchString(value)
}

// IsValidUrl() checks to see if a string is a valid URL using the CheckRegex function
func IsValidUrl(url string) bool {
	// Define a regular expression pattern for valid URLs
	regexPattern := `^https?://[\w\-]+(\.[\w\-]+)+[/#?]?.*$`

	// Use the CheckRegex() function and return the result
	return CheckRegex(url, regexPattern)
}
