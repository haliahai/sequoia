import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

function TodoForm({ task, setTask, todos, setTodos }) {
  
  function createNewTodo() {
    const id = parseInt(Date.now().toString());
    return { ID: id, Task: task, Status: 'Pending' };
  }

  function addTodo(newTodo) {
    fetch('/api/todo/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Added new task, id=${newTodo.ID}, response: ${JSON.stringify(data)}`);
      setTodos(data);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    addTodo(createNewTodo());
    setTask('');
  }

  return (
    <form onSubmit={handleSubmit} id="todo-form">
      <div className="flex mb-4">
        <TaskInput task={task} setTask={setTask} />
        <AddButton todos={todos} />
      </div>
    </form>
  );
}

function AddButton() {
  return (
    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Add
    </button>
  );
}

function TaskInput({ task, setTask }) {
  return (
    <input
      type="text"
      className="w-full px-4 py-2 mr-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
      id="todo-input"
      placeholder="Add new task"
      value={task}
      onChange={(e) => setTask(e.target.value)}
      required
    />
  );
}

function TaskList({ todos, setTodos}) {

  function handleToggle(id){

    const newTodo = todos.find(todo => todo.ID === id);
    newTodo.Status = newTodo.Status === 'Completed' ? 'Pending' : 'Completed';
    
    fetch('/api/todo/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Toggled task status, id=${id}, response: ${JSON.stringify(data)}`);
      setTodos(data);
    });
  };

  return (
    <ul id="todo-list">
      {todos.map(todo => (
        <li
          key={todo.ID}
          className="border-b border-gray-200 flex items-center justify-between py-4"
        >
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={todo.Status === 'Completed' ? true : false}
            onChange={() => handleToggle(todo.ID, todo.Status)}
          />
          <span className={todo.Completed === 'Completed' ? 'Completed' : 'Pending'}>
            {todo.Task}
          </span>
        </label>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto my-10">
        <h1 className="text-center text-3xl font-semibold mb-4">To Do List</h1>
        <div className="md:w-1/2 mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <TodoForm task={task} setTask={setTask} todos={todos} setTodos={setTodos} />
            <TaskList todos={todos} setTodos={setTodos} />
          </div>
        </div>
      </div>
    </div>
  );
}