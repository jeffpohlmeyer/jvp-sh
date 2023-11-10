package main

import (
	"errors"
	"fmt"
	"github.com/jeffpohlmeyer/jvp-sh/internal/models"
	"github.com/jeffpohlmeyer/jvp-sh/internal/validator"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type urlCreateForm struct {
	Url                 string `form:"url"`
	validator.Validator `form:"-"`
}

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	// Call the newTemplateData() helper to get a templateData struct containing the 'default' data (which for now
	// just contains the current year)
	data := app.newTemplateData(r)
	data.Form = urlCreateForm{}
	app.render(w, r, http.StatusOK, "home.html", data)
}

func (app *application) redirectCreate(w http.ResponseWriter, r *http.Request) {
	// Declare a new empty instance of the urlCreateForm
	var form urlCreateForm

	// First we call r.ParseForm() which adds any data in POST request bodies
	// to the r.PostForm map. This also works in the same way for PUT and PATCH
	// requests. If there are any errors, we use our app.ClientError() helper to
	// send a 400 Bad Request response to the user.
	err := app.decodePostForm(r, &form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	// Because the Validator struct is embedded by the urlCreateForm struct,
	// we can call CheckField() directly on it to execute our validation checks.
	// CheckField() will add the provided key and error message to the
	// FieldErrors map if the check does not evaluate to true. For example, in
	// the first line here we "check that the form.Url field is not blank". In
	// the second, we "check that the form.Url field is a valid URL and so on
	form.CheckField(validator.NotBlank(form.Url), "url", "Url cannot be blank")
	form.CheckField(validator.IsValidUrl(form.Url), "url", "Url is not valid")

	// Use the Valid() method to see if any of the checks failed. If they did,
	// then re-render the template passing in the form in the same way as
	// before
	if !form.Valid() {
		data := app.newTemplateData(r)
		data.Form = form
		app.render(w, r, http.StatusUnprocessableEntity, "home.html", data)
		return
	}

	// Create the new url record in the database using the url model's Insert()
	// method. If this returns an error, we log the detailed error message and
	// send a 500 Internal Server Error response to the user.
	redirect, err := app.urls.Insert(form.Url)
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("/u/%s+", redirect), http.StatusSeeOther)
}

func (app *application) redirectShow(w http.ResponseWriter, r *http.Request) {
	// Retrieve the "shortUrl" parameter from the query string. If none exists,
	// then we redirect the user to the homepage.
	params := httprouter.ParamsFromContext(r.Context())
	shortUrl := params.ByName("shortUrl")
	app.logger.Info(fmt.Sprintf("shortUrl %s", shortUrl))
	if shortUrl == "" {
		app.clientError(w, http.StatusNotFound)
		return
	}

	// Use the url model's Get() method to retrieve the data for a specific
	// url based on the shortUrl value. If no matching record is found, we
	// redirect the user to the homepage.
	url, err := app.urls.Get(shortUrl)
	app.logger.Info(fmt.Sprintf("url %s", url.Redirect))
	if err != nil {
		if errors.Is(err, models.ErrRecordNotFound) {
			app.clientError(w, http.StatusNotFound)
		} else {
			app.serverError(w, r, err)
		}
		return
	}

	lastChar := shortUrl[len(shortUrl)-1:]
	if lastChar == "+" {
		data := app.newTemplateData(r)
		app.render(w, r, http.StatusOK, "shortened.html", data)
	}
	app.logger.Info(fmt.Sprintf("url.URL %s", url.Redirect))
	http.Redirect(w, r, url.Redirect, http.StatusPermanentRedirect)
}
