import { useState } from "react";
import { assignRoleByEmail } from "../utils/assignRole";
import { useEventRole } from "../context/EventRoleContext";

const CollaboratorInviteForm = ({ eventId }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("vendor");
  const [feedback, setFeedback] = useState("");
  const userRole = useEventRole();

  if (userRole !== "admin") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("Assigning role...");
    try {
      await assignRoleByEmail(eventId, email, role);
      setFeedback(`✅ ${email} assigned as ${role}`);
      setEmail("");
      setRole("vendor");
    } catch (err) {
      setFeedback(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <h4>Assign a Role to a Collaborator</h4>
      <input
        type="email"
        placeholder="Collaborator's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="co_organizer">Co-Organizer</option>
        <option value="vendor">Vendor</option>
        <option value="guest">Guest</option>
      </select>
      <button type="submit">Assign</button>
      {feedback && <p>{feedback}</p>}
    </form>
  );
};

export default CollaboratorInviteForm;
