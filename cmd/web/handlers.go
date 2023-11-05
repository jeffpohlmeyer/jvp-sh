package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	files := []string{
		"./ui/html/base.html",
		"./ui/html/partials/nav.html",
		"./ui/html/pages/home.html",
	}

	ts, err := template.ParseFiles(files...)
	if err != nil {
		log.Print(err.Error())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	err = ts.ExecuteTemplate(w, "base", nil)
	if err != nil {
		log.Print(err.Error())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (app *application) redirectCreate(w http.ResponseWriter, r *http.Request) {
	// First we call r.ParseForm() which adds any data in POST request bodies
	// to the r.PostForm map. This also works in the same way for PUT and PATCH
	// requests. If there are any errors, we use our app.ClientError() helper to
	// send a 400 Bad Request response to the user.
	err := r.ParseForm()
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	// Use the r.PostForm.Get() method to retrieve the url from the r.PostForm map
	// If there is no matching parameter, or the parameter is empty, then the
	// url variable will be set to the empty string.
	url := r.PostForm.Get("url")

	// If the url field is empty then add a "Url cannot be blank" error message to
	// the validationErrors map. Notice that we then return the validationErrors
	// map to the user using our app.badRequest() helper. This will render the
	// form again along with the validation errors. If there were no errors, then
	// we just log a message and redirect the user to the relevant page.
	if url == "" {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	// Create the new url record in the database using the url model's Insert()
	// method. If this returns an error, we log the detailed error message and
	// send a 500 Internal Server Error response to the user.
	redirect, err := app.urls.Insert(url)
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("/%s+", redirect), http.StatusSeeOther)
}
