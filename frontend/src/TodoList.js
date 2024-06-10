import React from 'react';
import { useState } from 'react';
import EditModal from './EditModal';

function TodoList({ todos, setTodos }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  const handleEdit = (id) => {
    const todo = todos.find(todo => todo.ID === id);
    console.log(`handleEdit(): id=${id}, task=${todo.Task}, description=${todo.Description}, status=${todo.Status}`)
    setCurrentTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleSave = (id, task, description, status) => {
    const newTodo = { ID: id, Task: task, Description: description, Status: status };
    fetch('/api/v1/edit/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Toggled task status, id=${id}, response: ${JSON.stringify(data)}`);
      setTodos(data);
    });
    setIsEditModalOpen(false);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
  };

  function handleToggle(id) {
    const newTodo = todos.find(todo => todo.ID === id);
    newTodo.Status = newTodo.Status === 'Completed' ? 'Pending' : 'Completed';

    fetch('/api/v1/edit/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Toggled task status, id=${id}, response: ${JSON.stringify(data)}`);
      setTodos(data);
    });
  }

  function handleDelete(id) {
    fetch(`/api/v1/delete/todo/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Deleted task, id=${id}, response: ${JSON.stringify(data)}`);
      setTodos(data);
    });
  }

  return (
    <div>
      <ul id="todo-list">
        {todos.map(todo => (
          <li
            key={todo.ID}
            className="border-b border-gray-200 flex items-center justify-between py-4"
          >
            <label className="flex items-center">
              <div>
                  <div>
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={todo.Status === 'Completed'}
                        onChange={() => handleToggle(todo.ID)}
                      />
                      <span className={todo.Status === 'Completed' ? 'line-through' : ''}>
                        {todo.Task}
                      </span>
                  </div>
                  <div className="text-gray-500">
                      {todo.Description}
                  </div>
              </div>
            </label>
            <div>
              <button
                className="text-red-500 hover:text-red-700 mr-2 delete-btn"
                onClick={() => handleDelete(todo.ID)}
              >
                Delete
              </button>
              <button
                className="text-blue-500 hover:text-blue-700 edit-btn"
                onClick={() => handleEdit(todo.ID)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        id={currentTodo ? currentTodo.ID : null}
        selectedTask={currentTodo ? currentTodo.Task : null}
        selectedDescription={currentTodo ? currentTodo.Description : null}
        status={currentTodo ? currentTodo.Status : null}
      />
    </div>
  );
}

export default TodoList;
