import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from '../TaskForm.module.scss'; // Import the SCSS module
import { useEventRole } from '../context/EventRoleContext.jsx'; // Assuming this path is correct

const TaskForm = ({ eventId }) => {
  const [taskName, setTaskName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [collaborators, setCollaborators] = useState({}); // You'll need to populate this from Firebase
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const role = useEventRole(); // Assuming this hook provides the user's role
  const maxLength = 100;

  // ✅ Check permissions before rendering the form
  if (!['admin', 'co_organizer'].includes(role)) {
    return (
      <div className={styles.restricted}>
        <p>You don’t have permission to add tasks.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      // Assuming 'user' is available from your auth context or similar
      const user = { uid: 'current_user_uid' }; // Placeholder: Replace with actual user UID
      
      await addDoc(collection(db, `events/${eventId}/tasks`), {
        name: taskName,
        completed: false,
        eventId: eventId,
        assignedTo: assignedTo || null, // Assign null if not selected
        createdAt: new Date(),
        createdBy: user.uid,
      });
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
          className={`${styles.inputField} ${error && !taskName.trim() ? styles.error : ''}`}
          disabled={isLoading}
          aria-required="true"
          maxLength={maxLength}
        />
      </label>

      {/* Assignment Dropdown */}
      <label htmlFor="assign-user" className={styles.label}>
        Assign To
        <select
          id="assign-user"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className={styles.inputField} // Reusing inputField style for select
          disabled={isLoading}
        >
          <option value="">-- Optional --</option>
          {/* You need to fetch and populate 'collaborators' state for this to work */}
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
        disabled={isLoading || !eventId || !taskName.trim()} // Disable if taskName is empty
        aria-label="Add task to event"
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>

      {isLoading && <p className={styles.feedback}>Adding task...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </form>
  );
};

export default TaskForm;