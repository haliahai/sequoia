package main

import (
	"fmt"
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

func (l *TodoList) CreateList() (*TodoList, error) {
	l.Entries = make(map[int64]Todo)
	return l, nil
}

func (l *TodoList) AddItem(t *Todo) ([]Todo, error) {
	if err := t.validate(); err != nil {
		return nil, err
	}

	l.Entries[t.ID] = *t

	return l.getValues(), nil
}

func (l *TodoList) EditItem(t Todo) ([]Todo, error) {
	if err := t.validate(); err != nil {
		return nil, err
	}

	if err := l.checkExists(t.ID); err != nil {
		return nil, err
	}

	l.Entries[t.ID] = t

	return l.getValues(), nil
}

func (l *TodoList) DeleteItemByID(id int64) (*Todo, error) {
	if err := l.checkExists(id); err != nil {
		return nil, err
	}

	todo := l.Entries[id]
	delete(l.Entries, id)
	return &todo, nil
}

func (l *TodoList) getValues() []Todo {
	v := make([]Todo, 0, len(l.Entries))

	for _, value := range l.Entries {
		v = append(v, value)
	}

	return v
}

func (t *Todo) validate() error {
	if t.ID < 0 {
		return fmt.Errorf("id must be a positive integer")
	}
	if t.Status != StatusPending && t.Status != StatusCompleted {
		return fmt.Errorf("status must be either 'pending' or 'completed'")
	}
	if t.Task == "" {
		return fmt.Errorf("task must not be empty")
	}
	if len(t.Task) > 140 {
		return fmt.Errorf("task must be at most 140 characters long")
	}
	return nil
}

func (l *TodoList) checkExists(id int64) error {
	_, ok := l.Entries[id]
	if !ok {
		return fmt.Errorf("no ToDo found with ID: %d", id)
	}
	return nil
}
