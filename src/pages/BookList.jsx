import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .listBooks()
      .then((data) => {
        if (mounted) setBooks(Array.isArray(data) ? data : data.books || []);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Catalog</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {books.map((b) => (
          <li
            key={b.id}
            style={{
              padding: 12,
              borderBottom: "1px solid #eee",
              display: "flex",
              gap: 12,
            }}
          >
            <img
              src={b.coverimage}
              alt={b.title}
              style={{ width: 80, height: 120, objectFit: "cover" }}
            />
            <div>
              <Link to={`/books/${b.id}`}>
                <strong>{b.title}</strong>
              </Link>
              <div>by {b.author}</div>
              <div>{b.available ? "Available" : "Reserved"}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
