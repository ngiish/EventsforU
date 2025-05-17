import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from '../TaskForm.module.scss';

const TaskForm = ({ eventId }) => {
  const [taskName, setTaskName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 100;

  console.log('TaskForm eventId:', eventId); // Added for debugging

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, taskName:', taskName, 'eventId:', eventId);
    setError('');

    // Validation
    if (!taskName.trim()) {
      setError('Task name cannot be empty.');
      return;
    }
    if (taskName.length > maxLength) {
      setError(`Task name cannot exceed ${maxLength} characters.`);
      return;
    }
    if (!eventId) {
      setError('Invalid event ID. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, `events/${eventId}/tasks`), {
        name: taskName,
        completed: false,
        eventId,
        createdAt: new Date(),
      });
      console.log('Task added successfully')
      setTaskName('');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm}>
     <label htmlFor="task-name" className={styles.label}>
        Add Task
        <input
          id="task-name"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Add a task (e.g., Book caterer)"
          className={styles.inputField}
          disabled={isLoading}
          aria-required="true"
          maxLength={maxLength}
        />
      </label>
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isLoading || !eventId}
        aria-label="Add task to event"
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
      {isLoading && <p className={styles.feedback}>Adding task...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default TaskForm;