import { useEffect, useState } from "react";
import { useAuth } from "../pages/useAuth";
import { api } from "../api";

export default function Account() {
  const { token, user, displayName, setUser } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getMyReservations(token)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.reservations || data);
        if (mounted) setReservations(list || []);
      })
      .catch(async () => {
        try {
          const profile = await api.getProfile(token);
          if (mounted) setReservations(profile.reservations || []);
        } catch (err) {
        console.error(err);        
      }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [token, setUser]);

  const handleReturn = async (reservationId) => {
    try {
      await api.returnReservation(reservationId, token);
      setReservations((r) => r.filter((x) => x.id !== reservationId));
      try {
        const profile = await api.getProfile(token);
        setUser(profile);
      } catch (err) {
        console.error(err);        
      }
    } catch (err) {
      alert(err.message || "Could not return book");
    }
  };

  if (loading) return <div>Loading account...</div>;

  return (
    <div>
      <h2>Account</h2>
      <div><strong>Name</strong>: {displayName || `${user?.firstname} ${user?.lastname}`}</div>
      <div><strong>Email</strong>: {user?.email}</div>

      <h3 style={{ marginTop: 16 }}>Your Reservations</h3>
      {reservations.length === 0 ? (
        <div>No reservations yet</div>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {reservations.map((r) => (
            <li key={r.id} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
              <div><strong>{r.title}</strong> by {r.author}</div>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => handleReturn(r.id)}>Return</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
