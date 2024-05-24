package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

var todos ToDoList = ToDoList{}

func getToDoList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func checkToDo(w http.ResponseWriter, r *http.Request) {
	var todo ToDo = ToDo{}
	err := json.NewDecoder(r.Body).Decode(&todo)

	if err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	result, err := todos.CheckToDo(todo.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func addToDo(w http.ResponseWriter, r *http.Request) {
	var todo ToDo = ToDo{}
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

func deleteByID(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)

	if err != nil {
		http.Error(w, "failed to convert id to integer", http.StatusBadRequest)
		return
	}

	if id < 0 {
		http.Error(w, "id must be a positive integer", http.StatusBadRequest)
		return
	}

	todo, ok := todos.Entries[id]

	if !ok {
		http.Error(w, "no ToDo found with ID: "+idStr, http.StatusBadRequest)
		return
	}

	delete(todos.Entries, todo.ID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func main() {
	router := mux.NewRouter()

	todos.CreateList()

	router.HandleFunc("/api/todo", getToDoList).Methods("GET")
	router.HandleFunc("/api/todo/check", checkToDo).Methods("POST")
	router.HandleFunc("/api/todo/add", addToDo).Methods("POST")
	router.HandleFunc("/api/todo/delete/{id}", deleteByID).Methods("DELETE")

	// router.HandleFunc("/api/todo/edit", editToDo).Methods("POST")

	// todos = append(todos, Todo{ID: "1", Task: "Learn Go", Status: "In Progress"})
	// todos = append(todos, Todo{ID: "2", Task: "Learn React", Status: "Not Started"})

	http.ListenAndServe(":8000", router)
}
