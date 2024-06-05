package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"

	"github.com/gorilla/mux"
)

type Status string

const (
	StatusPending   Status = "Pending"
	StatusCompleted Status = "Completed"
)

type ToDo struct {
	ID          int64  `json:"ID"`
	Task        string `json:"Task"`
	Description string `json:"Description"`
	CreatedAt   string `json:"CreatedAt"`
	Status      Status `json:"Status"`
}

type ToDoList struct {
	Entries map[int64]ToDo `json:"Entries"`
}

func (l *ToDoList) ToSlice() []ToDo {
	todos := make([]ToDo, 0, len(l.Entries))
	for _, todo := range l.Entries {
		todos = append(todos, todo)
	}

	sort.Slice(todos, func(i, j int) bool {
	    return todos[i].ID < todos[j].ID
    })

	return todos
}

var todos = ToDoList{Entries: make(map[int64]ToDo)}

func getTodosHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos.ToSlice())
}

func createTodoHandler(w http.ResponseWriter, r *http.Request) {
	var todo ToDo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	todo.ID = int64(len(todos.Entries) + 1)
	todos.Entries[todo.ID] = todo

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos.ToSlice())
}

func editTodoHandler(w http.ResponseWriter, r *http.Request) {
	var todo ToDo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	todos.Entries[todo.ID] = todo
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos.ToSlice())
}

func deleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		http.Error(w, "Invalid ToDo ID", http.StatusBadRequest)
		return
	}

	delete(todos.Entries, id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos.ToSlice())
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/v1/get/todo", getTodosHandler).Methods("GET")
	r.HandleFunc("/api/v1/create/todo", createTodoHandler).Methods("POST")
	r.HandleFunc("/api/v1/edit/todo", editTodoHandler).Methods("POST")
	r.HandleFunc("/api/v1/delete/todo/{id}", deleteTodoHandler).Methods("DELETE")

	http.Handle("/", r)
	fmt.Println("Server started at http://localhost:8080")
	http.ListenAndServe(":8080", r)
}
