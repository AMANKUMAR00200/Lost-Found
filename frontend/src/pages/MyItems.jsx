import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/items/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Item Deleted");

      fetchMyItems();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Items</h1>

      <Link to="/dashboard">
        <button>← Back to Home</button>
      </Link>

      <br />
      <br />

      {items.length === 0 ? (
        <h3>No Items Found</h3>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h2>{item.title}</h2>

            <p>
              <strong>Type:</strong> {item.type}
            </p>

            <p>{item.description}</p>

            <p>
              <strong>Location:</strong> {item.location}
            </p>

            <p>
              <strong>Status:</strong> {item.status}
            </p>

            <button
              onClick={() => deleteItem(item.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyItems;