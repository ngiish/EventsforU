import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from '../TaskForm.module.scss';
import { useEventRole } from '../context/EventRoleContext.jsx';

const TaskForm = ({ eventId }) => {
  const [taskName, setTaskName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [collaborators, setCollaborators] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const role = useEventRole();

  const maxLength = 100;

  // ✅ Check permissions before rendering the form
  if (!['admin', 'co_organizer'].includes(role)) {
    return (
      <div className={styles.restricted}>
        <p>You don’t have permission to add tasks.</p>
      </div>
    );
  }

  console.log('TaskForm eventId:', eventId); // Added for debugging

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, taskName:', taskName, 'eventId:', eventId);
    setError('');
    setSuccess('');

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
        eventId: eventId,
        createdAt: new Date(),
        createdBy: user.uid,
      });
      console.log('Task added successfully')
      setTaskName('');
      setAssignedTo('');
      setSuccess('Task added successfully!');
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
        Task Name
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

       {/* 👇 Assignment Dropdown */}
      <label htmlFor="assign-user" className={styles.label}>
        Assign To
        <select
          id="assign-user"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className={styles.inputField}
          disabled={isLoading}
        >
          <option value="">-- Optional --</option>
          {Object.entries(collaborators).map(([uid, role]) => (
            <option key={uid} value={uid}>
              {uid} ({role})
            </option>
          ))}
        </select>
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
      {success && <p clasName={styles.success}>{success}</p>}
    </form>
  );
};

export default TaskForm;