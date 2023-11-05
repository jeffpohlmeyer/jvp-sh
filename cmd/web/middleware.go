package main

import (
	"fmt"
	"net/http"
)

func secureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy",
			"default-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com")

		w.Header().Set("Referrer-Policy", "origin-when-cross-origin")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "deny")
		w.Header().Set("X-XSS-Protection", "0")

		next.ServeHTTP(w, r)
	})
}

// The logRequest() middleware is used to log information about every request
// made to the application. This includes the remote IP address, the HTTP
// method, the requested URI, and the time taken to process the request. This
// information is written to the standard logger, which means that it will be
// printed to the terminal.
func (app *application) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var (
			ip     = r.RemoteAddr
			proto  = r.Proto
			method = r.Method
			uri    = r.URL.RequestURI()
		)

		app.logger.Info("received request", "ip", ip, "proto", proto, "method", method, "uri", uri)

		next.ServeHTTP(w, r)
	})
}

// The recoverPanic() middleware is used to recover from a panic and log any
// error message before sending a generic "Server Error" response to the user.
// This should only be used in a production environment. In a development
// environment you should let the built-in handler recover from the panic, so
// that you get the server error page with all the debug information.
func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Defer a function to recover from any panics.
		defer func() {
			if err := recover(); err != nil {

				// Use the app.serverError() helper to return a 500 Internal
				// Server response.
				w.Header().Set("Connection", "close")

				app.serverError(w, r, fmt.Errorf("%s", err))
			}
		}()

		next.ServeHTTP(w, r)
	})
}
