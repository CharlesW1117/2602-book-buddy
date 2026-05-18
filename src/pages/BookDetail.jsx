import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../pages/useAuth";


export default function BookDetail() {
  const { id } = useParams();
  const { token, setUser } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api.getBook(id)
      .then((data) => { if (mounted) setBook(data); })
      .catch((err) => { if (mounted) setError(err.message || "Failed to load"); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const reserve = async () => {
    if (!token) return navigate("/login");
    setActionLoading(true);
    try {
      await api.reserveBook(Number(id), token);
      const refreshed = await api.getBook(id);
      setBook(refreshed);
      try {
        const profile = await api.getProfile(token);
        setUser(profile);
      } catch (err) {
        console.error(err);        
      }
      alert("Reserved successfully.");
    } catch (err) {
      alert(err.message || "Could not reserve");
    } finally {
      setActionLoading(false);
    }
  };

  const returnBook = async () => {
    if (!token) return navigate("/login");
    setActionLoading(true);
    try {
      const reservations = await api.getMyReservations(token);
      const list = Array.isArray(reservations) ? reservations : (reservations.reservations || reservations);
      const found = list.find((r) => Number(r.bookid) === Number(id) || Number(r.bookId) === Number(id));
      if (!found) {
        alert("Could not find your reservation for this book.");
        setActionLoading(false);
        return;
      }
      await api.returnReservation(found.id, token);
      const refreshed = await api.getBook(id);
      setBook(refreshed);
      try {
        const profile = await api.getProfile(token);
        setUser(profile);
      } catch (err) {
        console.error(err);        
      }
      alert("Returned successfully.");
    } catch (err) {
      alert(err.message || "Could not return");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Loading book...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <img src={book.coverimage} alt={book.title} style={{ width: 180, height: 260, objectFit: "cover" }} />
      <div>
        <h2>{book.title}</h2>
        <div><strong>Author</strong>: {book.author}</div>
        <div style={{ marginTop: 12 }}><strong>Description</strong>: {book.description}</div>
        <div style={{ marginTop: 12 }}><strong>Status</strong>: {book.available ? "Available" : "Reserved"}</div>

        {token ? (
          <>
            {book.available ? (
              <button onClick={reserve} disabled={actionLoading} style={{ marginTop: 12 }}>Reserve</button>
            ) : (
              <button onClick={returnBook} disabled={actionLoading} style={{ marginTop: 12 }}>Return (if yours)</button>
            )}
          </>
        ) : (
          <div style={{ marginTop: 12 }}><a href="/login">Log in</a> to reserve this book</div>
        )}
      </div>
    </div>
  );
}
