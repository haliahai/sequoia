import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: 'HTML', completed: false },
    { id: 2, text: 'CSS', completed: false },
    { id: 3, text: 'JS', completed: false },
    { id: 4, text: 'Bootstrap', completed: false },
  ]);

  const addTask = (taskText) => {
    setTodos([
      ...todos,
      { id: Date.now(), text: taskText, completed: false },
    ]);
    setTask('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (task.trim() !== '') {
      addTask(task);
    }
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEdit = (id) => {
    const newText = prompt('Enter new task', todos.find(todo => todo.id === id).text);
    if (newText !== null && newText.trim() !== '') {
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, text: newText.trim() } : todo)));
    }
  };

  const handleToggle = (id) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto my-10">
        <h1 className="text-center text-3xl font-semibold mb-4">To Do List</h1>
        <div className="md:w-1/2 mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} id="todo-form">
              <div className="flex mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 mr-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                  id="todo-input"
                  placeholder="Add new task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add
                </button>
              </div>
            </form>
            <ul id="todo-list">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="border-b border-gray-200 flex items-center justify-between py-4"
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                    />
                    <span className={todo.completed ? 'completed' : ''}>
                      {todo.text}
                    </span>
                  </label>
                  <div>
                    <button
                      className="text-red-500 hover:text-red-700 mr-2 delete-btn"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700 edit-btn"
                      onClick={() => handleEdit(todo.id)}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



// import logo from './logo.svg';
// import './App.css';

// import React, { useState, useEffect } from 'react';





// function App() {
//   const [todos, setTodos] = useState([]);
//   const [task, setTask] = useState('');

//   useEffect(() => {
//     fetch('/api/todos')
//       .then(response => response.json())
//       .then(data => setTodos(data));
//   }, []);

//   const addTodo = () => {
//     const newTodo = { id: Date.now().toString(), task, status: 'Not Started' };
//     fetch('/api/todos', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newTodo)
//     })
//     .then(response => response.json())
//     .then(data => setTodos([...todos, data]));
//     setTask('');
//   };

//   const removeTodo = () => {
//     fetch(`/api/todos/remove`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newTodo)
//     })
//     .then(response => response.json())
//     .then(data => setTodos(data));
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">ToDo List</h1>
//       <div className="mb-4">
//         <input
//           type="text"
//           value={task}
//           onChange={(e) => setTask(e.target.value)}
//           className="border p-2 mr-2"
//           placeholder="Add a new task"
//         />
//         <button onClick={addTodo} className="bg-blue-500 text-white p-2">Add</button>
//         <button onClick={removeTodo} className="bg-red-500 text-white p-2">Remove</button>
//       </div>
//       <ul>
//         {todos.map(todo => (
//           <li key={todo.id} className="border p-2 mb-2">
//             {todo.task} - {todo.status}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
