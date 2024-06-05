import React from 'react';

function TodoForm({ task, setTask, description, setDescription, todos, setTodos }) {
  
  function createNewTodo() {
    const id = parseInt(Date.now().toString());
    return { ID: id, Task: task, Description: description, Status: 'Pending' };
  }

  function addTodo(newTodo) {
    fetch('/api/v1/create/todo', {
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
    if (task.trim() !== '') {
      addTodo(createNewTodo());
      setTask('');
      setDescription('');
    }
  }

  return (
    <form onSubmit={handleSubmit} id="todo-form">
      <div className="flex justify-end items-center mb-4">
        <TaskInput task={task} setTask={setTask} description={description} setDescription={setDescription} />
        <AddButton />
      </div>
    </form>
  );
}

function AddButton() {
  return (
    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-20 h-10">
      Add
    </button>
  );
}

function TaskInput({ task, setTask, description, setDescription }) {
  return (
    <div className="flex w-full mb-4">
        <div className="w-full bg-white-500 h-12">
            <input
              type="text"
              className="w-full px-4 py-2 mr-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              id="todo-input"
              placeholder="Add new task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
            <input
              type="text"
              className="w-full px-4 py-2 mr-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              id="todo-input"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
        </div>
    </div>
  );
}

export default TodoForm;
