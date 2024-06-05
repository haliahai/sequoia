import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default function App() {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/api/v1/get/todo', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Get todos, response: ${JSON.stringify(data)}`);
      setTodos(data);
    });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto my-10">
        <h1 className="text-center text-3xl font-semibold mb-4">To Do List</h1>
        <div className="md:w-1/2 mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <TodoForm task={task} setTask={setTask} description={description} setDescription={setDescription} todos={todos} setTodos={setTodos} />
            <TodoList todos={todos} setTodos={setTodos} />
          </div>
        </div>
      </div>
    </div>
  );
}
