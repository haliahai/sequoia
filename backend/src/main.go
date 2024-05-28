package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

var todos TodoList = TodoList{}

func getToDoList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func addToDo(w http.ResponseWriter, r *http.Request) {
	var todo Todo = Todo{}
	err := json.NewDecoder(r.Body).Decode(&todo)

	if err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}

	list, err := todos.AddItem(&todo)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(list)
}

func handleError(w http.ResponseWriter, err error, message string, code int) {
	if err != nil {
		http.Error(w, message, code)
		return
	}
}

func encodeJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func parseID(w http.ResponseWriter, r *http.Request) (int64, error) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "failed to convert id to integer", http.StatusBadRequest)
		return 0, err
	}

	if id < 0 {
		http.Error(w, "id must be a positive integer", http.StatusBadRequest)
		return 0, fmt.Errorf("id must be a positive integer")
	}

	return id, nil
}

func deleteByID(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(w, r)
	if err != nil {
		return
	}

	todo, error := todos.DeleteItemByID(id)
	handleError(w, error, error.Error(), http.StatusBadRequest)

	if todo == nil {
		http.Error(w, "no todo found with id: "+strconv.FormatInt(id, 10), http.StatusNotFound)
		return
	}

	encodeJSON(w, todos)
}

func editByID(w http.ResponseWriter, r *http.Request) {
	var t Todo = Todo{}
	err := json.NewDecoder(r.Body).Decode(&t)
	handleError(w, err, "Failed to decode JSON", http.StatusBadRequest)

	list, err := todos.EditItem(t)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	encodeJSON(w, list)
}

func main() {
	router := mux.NewRouter()

	todos.CreateList()

	router.HandleFunc("/api/todo", getToDoList).Methods("GET")
	router.HandleFunc("/api/todo/add", addToDo).Methods("POST")
	router.HandleFunc("/api/todo/delete/{id}", deleteByID).Methods("DELETE")
	router.HandleFunc("/api/todo/edit", editByID).Methods("POST")

	http.ListenAndServe(":8000", router)
}
