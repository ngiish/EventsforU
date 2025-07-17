import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useEventRole } from '../context/EventRoleContext.jsx';
import styles from '../TaskList.module.scss';

const TaskList = ({ eventId }) => {
  const [tasks, setTasks] = useState([]);
  const [editTaskID,setEditTaskID] = useState(null);
  const[editTaskName, setEditTaskName] = useState('');
  const role = useEventRole();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!eventId) return;

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

   // ✅ Filter tasks based on user role
  const visibleTasks = tasks.filter((task) => {
    if (['admin', 'co_organizer'].includes(role)) return true;
    if (role === 'vendor') return task.assignedTo === userId;
    if (role === 'guest') return true;
    return false;
  });

  const handleComplete = async (taskId, completed) => {
    if (!['admin', 'co_organizer', 'vendor'].includes(role)) return;
    try {
      const taskRef = doc(db, `events/${eventId}/tasks`, taskId);
      await updateDoc(taskRef, { completed: !completed });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!['admin', 'co_organizer'].includes(role)) return;
    try {
      const taskRef = doc(db, `events/${eventId}/tasks`, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (taskId, name) => {
    if (!['admin', 'co_organizer'].includes(role)) return;
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
      {visibleTasks.length === 0 ? (
        <li className={styles.empty}>No tasks yet</li>
      ) : (
        visibleTasks.map((task) => (
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
                {['admin', 'co_organizer'].includes(role) && (
                <button
                  onClick={() => handleEdit(task.id, task.name)}
                  className={styles.editBtn}
                  aria-label={`Edit task: ${task.name}`}
                >
                  Edit
                </button>
                )}
              </div>
            )}
            {['admin', 'co_organizer'].includes(role) && (
            <button
              onClick={() => handleDelete(task.id)}
              className={styles.deleteBtn}
              aria-label={`Delete task: ${task.name}`}
            >
              Delete
            </button>
            )}
          </li>
        ))
      )}
    </ul>
  );
};

export default TaskList;