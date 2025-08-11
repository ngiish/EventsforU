import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import styles from '../EventCard.module.scss';

const EventCard = ({ title, date, id, taskCount = 0, completedTasks = 0, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000); // Reset after 3 seconds
      return;
    }

    if (!id) {
      setErrorMessage('Event ID is missing. CAnnt delete.');
      setShowConfirm(false);
      return;
    }

    setIsDeleting(true);
    try {
      //Remove from firestore
      await deleteDoc(doc(db, 'events', id));

      //Instantly remove from UI by notifying parent
      if (typeof onDelete === 'fuction') {
        onDelete(id);
      }

    } catch (error) {
      console.error('Error deleting event:', error);
      setErrorMessage("Failed to delete event. Please try again.")
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const completionPercentage = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div className={styles.eventCard}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.dateContainer}>
          <span className={styles.dateIcon}>📅</span>
          <p className={styles.date}>{formatDate(date)}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        {/* Task Form Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4>Add New Task</h4>
            <span className={styles.sectionBadge}>Create</span>
          </div>
          <div className={styles.taskFormSection}>
            <TaskForm eventId={id} />
          </div>
        </div>

        {/* Task List Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4>Tasks</h4>
            <span className={styles.sectionBadge}>{taskCount}</span>
          </div>
          <div className={styles.taskListSection}>
            <TaskList eventId={id} />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📋</span>
            <span>{taskCount} tasks</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>✅</span>
            <span>{completedTasks} completed</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📊</span>
            <span>{completionPercentage}% done</span>
          </div>
        </div>

        <div className={styles.cardActions}>
          <div className={`${styles.statusIndicator} ${taskCount > 0 ? styles.active : styles.inactive}`}>
            {taskCount > 0 ? 'Active' : 'No Tasks'}
          </div>
          
          <button
            onClick={handleDelete}
            className={`${styles.deleteBtn} ${showConfirm ? styles.confirming : ''}`}
            aria-label={`Delete event: ${title}`}
            disabled={isDeleting}
          >
            {errorMessage ? errorMessage : isDeleting ? 'Deleting...' : showConfirm ? 'Confirm Delete' : 'Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;