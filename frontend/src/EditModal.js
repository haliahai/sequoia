import React, { useState, useEffect } from 'react';

const EditModal = ({
    isOpen,
    onClose,
    onSave,
    id,
    selectedTask,
    selectedDescription,
    status
  }) => {

  const [task, setTask] = useState(selectedTask);
  const [description, setDescription] = useState(selectedDescription);

  useEffect(() => {
    setTask(selectedTask);
    setDescription(selectedDescription);
    console.log(`EditModal changed: id=${id}, task=${task}, description=${description}, selectedTask=${selectedTask}, selectedDescription=${selectedDescription}`);
  }, [isOpen, selectedTask, selectedDescription]);

  const handleSave = () => {
    onSave({ id, task, description, status });
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md w-1/3">
          <h2 className="text-xl mb-4">Edit Task</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="task">
              Task
            </label>
            <input
              type="text"
              id="task"
              name="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(id, task, description, status);
                setTask('');
                setDescription('');
              }}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      )
  );
};

export default EditModal;
