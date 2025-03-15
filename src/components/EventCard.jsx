function EventCard({ title = "Untitled", date = "No date"}) {
    return (
        <div className="event-card">
            <h3>{title}</h3>
            <p>Date: {date}</p>
        </div>
    );
}
export default EventCard;