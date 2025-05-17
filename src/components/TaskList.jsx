import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import styles from '../TaskList.module.scss';

const TaskList = ({ eventId }) => {
  const [tasks, setTasks] = useState([]);
  const [editTaskID,setEditTaskID] = useState(null);
  const[editTaskName, setEditTaskName] = useState('');

  useEffect(() => {
    const q = query(collection(db, `events/${eventId}/tasks`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskData);
    });
    return () => unsubscribe();
  }, [eventId]);

  const handleComplete = async (taskId, completed) => {
    try {
      const taskRef = doc(db, `events/${eventId}/tasks`, taskId);
      await updateDoc(taskRef, { completed: !completed });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const taskRef = doc(db, `events/${eventId}/tasks`, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (taskId, name) => {
    setEditTaskID(taskId);
    setEditTaskName(name);
  };

  const handleSave = async (taskId) => {
    if(!editTaskName.trim()) return;
    try {
      const taskRef = doc(db, `events/${eventId}/tasks`, taskId);
      await updateDoc(taskRef, { name: editTaskName });
      setEditTaskId(null);
      setEditTaskName('');
    } catch (error) {
      console.error('Error saving task:', error);
    }

  }

  return (
    <ul className={styles.taskList}>
      {tasks.length === 0 ? (
        <li className={styles.empty}>No tasks yet</li>
      ) : (
        tasks.map((task) => (
          <li key={task.id} className={styles.taskItem}>
            {editTaskId === task.id ? (
              <div className={styles.taskContent}>
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className={styles.inputField}
                  autoFocus
                />
                <button onClick={() => handleSave(task.id)} className={styles.saveBtn}>
                  Save
                </button>
                <button onClick={() => setEditTaskId(null)} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.taskContent}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleComplete(task.id, task.completed)}
                  className={styles.checkbox}
                />
                <span className={task.completed ? styles.completed : ''}>
                  {task.name}
                </span>
                <button
                  onClick={() => handleEdit(task.id, task.name)}
                  className={styles.editBtn}
                  aria-label={`Edit task: ${task.name}`}
                >
                  Edit
                </button>
              </div>
            )}
            <button
              onClick={() => handleDelete(task.id)}
              className={styles.deleteBtn}
              aria-label={`Delete task: ${task.name}`}
            >
              Delete
            </button>
          </li>
        ))
      )}
    </ul>
  );
};

export default TaskList;