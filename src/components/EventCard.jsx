import TaskForm from './TaskForm';
import TaskList from './TaskList';
import styles from '../EventCard.module.scss';

const EventCard = ({ title, date, id }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This will delete all associated tasks.')) {
      try {
        await deleteDoc(doc(db, 'events', id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };
  return (
    <div className={styles.eventCard}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.date}>{date}</p>
      <TaskForm eventId={id} />
      <TaskList eventId={id} />

      <button
        onClick={handleDelete}
        className={styles.deleteBtn}
        aria-label={`Delete event: ${title}`}
      >
        Delete Event
        </button>
    </div>
  );
};

export default EventCard;