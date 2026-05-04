import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [clients, setClients] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");

  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://client-backend-1hin.onrender.com/clients");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ================= ADD =================
  const addClient = async () => {
    if (!name || !email) {
      alert("Fill all fields");
      return;
    }

    const newClient = {
      name,
      email,
      status,
    };

    try {
      const res = await fetch("https://client-backend-1hin.onrender.com/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      const data = await res.json();
      setClients(data.clients);

      setName("");
      setEmail("");
      setStatus("Active");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================
  const deleteClient = async (name) => {
    try {
      const res = await fetch(
        `https://client-backend-1hin.onrender.com/clients/${name}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      setClients(data.clients);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Client Manager Dashboard</h1>

      {/* FORM */}
      <div className="form">
        <input
          placeholder="Client Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Client Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Active</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <button onClick={addClient}>Add Client</button>
      </div>

      {loading && <p>Loading...</p>}

      {/* GRID */}
      <div className="grid">
        {clients.map((client, index) => (
          <div className="card" key={index}>
            <div className="card-top">
              <h3>{client.name}</h3>
              <p>{client.email}</p>
            </div>

            <div className="card-bottom">
              <span className={`status ${client.status}`}>
                {client.status}
              </span>

              <button
                className="delete-btn"
                onClick={() => deleteClient(client.name)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="total">Total Clients: {clients.length}</h3>
    </div>
  );
}

export default App;