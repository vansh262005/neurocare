import React, { useEffect, useState } from 'react';
import { getTasks, completeTask } from '../services/api';

function Task() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(taskId, file) {
    try {
      await completeTask(taskId, file);
      loadTasks();
      alert('Task completed! 🎉');
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((t) => (
        <div key={t._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t.prompt}</h3>
          <p className="text-sm mb-1 capitalize">Category: {t.category}</p>
          <p className="text-sm mb-3 capitalize">Difficulty: {t.difficulty}</p>
          {t.status === 'completed' ? (
            <p className="text-green-600">Completed</p>
          ) : (
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Upload proof</span>
              <input type="file" accept="image/*" className="mt-1" onChange={(e) => handleComplete(t._id, e.target.files[0])} />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

export default Task;