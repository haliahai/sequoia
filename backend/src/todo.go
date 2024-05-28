package main

import (
	"fmt"
	"log"
)

type Status string

const (
	StatusPending   Status = "Pending"
	StatusCompleted Status = "Completed"
)

type Todo struct {
	ID     int64  `json:"ID"`
	Task   string `json:"Task"`
	Status Status `json:"Status"`
}

type TodoList struct {
	Entries map[int64]Todo `json:"Entries"`
}

func (s *Status) change() {
	if *s == StatusPending {
		*s = StatusCompleted
	} else {
		*s = StatusPending
	}
}

func (l *TodoList) CreateList() (*TodoList, error) {
	l.Entries = make(map[int64]Todo)
	return l, nil
}

func (t *TodoList) CheckToDo(id int64) (*Todo, error) {
	if id < 0 || id >= (int64)(len(t.Entries)) {
		return nil, fmt.Errorf("no ToDo found with ID: %d", id)
	}

	todo := t.Entries[id]
	todo.Status.change()
	t.Entries[id] = todo

	return &todo, nil
}

func (l *TodoList) AddItem(t *Todo) ([]Todo, error) {
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

	v := make([]Todo, 0, len(l.Entries))

	for _, value := range l.Entries {
		v = append(v, value)
	}

	log.Println("values: ", v)

	return v, nil
}

func (l *TodoList) EditItem(t Todo) ([]Todo, error) {
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

	_, ok := l.Entries[t.ID]

	if !ok {
		return nil, fmt.Errorf("no ToDo found with ID: %d", t.ID)
	}

	l.Entries[t.ID] = t

	v := make([]Todo, 0, len(l.Entries))

	for _, value := range l.Entries {
		v = append(v, value)
	}

	return v, nil
}

func (t *TodoList) DeleteItemByID(id int64) (*Todo, error) {
	todo, ok := todos.Entries[id]

	if !ok {
		return nil, fmt.Errorf("no ToDo found with ID: %d", todo.ID)
	}

	delete(todos.Entries, todo.ID)
	return &todo, nil
}
