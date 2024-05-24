package main

import "fmt"

type Status string

const (
	StatusPending   Status = "Pending"
	StatusCompleted Status = "Completed"
)

type ToDo struct {
	ID     int    `json:"id"`
	Task   string `json:"task"`
	Status Status `json:"status"`
}

type ToDoList struct {
	Entries map[int]ToDo `json:"entries"`
}

func (s *Status) change() {
	if *s == StatusPending {
		*s = StatusCompleted
	} else {
		*s = StatusPending
	}
}

func (l *ToDoList) CreateList() (*ToDoList, error) {
	l.Entries = make(map[int]ToDo)
	return l, nil
}

func (t *ToDoList) CheckToDo(id int) (*ToDo, error) {
	if id < 0 || id >= len(t.Entries) {
		return nil, fmt.Errorf("no ToDo found with ID: %d", id)
	}

	todo := t.Entries[id]
	todo.Status.change()
	t.Entries[id] = todo

	return &todo, nil
}

func (l *ToDoList) AddItem(t *ToDo) (*ToDoList, error) {
	if t.ID < 0 {
		return nil, fmt.Errorf("id must be a positive integer")
	}
	if t.Status != StatusPending && t.Status != StatusCompleted {
		return nil, fmt.Errorf("status must be either 'pending' or 'completed'")
	}
	if t.Task == "" {
		return nil, fmt.Errorf("task must not be empty")
	}
	if len(t.Task) > 140 {
		return nil, fmt.Errorf("task must be at most 140 characters long")
	}

	l.Entries[t.ID] = *t

	return l, nil
}

func (t *ToDoList) DeleteByID(id string) error {
	// Implement your logic here
	return nil
}

func (t *ToDoList) EditByID(id string, newEntry ToDo) error {
	// Implement your logic here
	return nil
}
