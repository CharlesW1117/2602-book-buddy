import { Link } from "react-router-dom";
import { useAuth } from "../pages/useAuth";

export default function NavBar() {
  const { user, displayName, logout } = useAuth();
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ddd", display: "Flex", gap: 12 }}>
      <Link to="/books">Books</Link>
      <Link to="/account">Account</Link>
      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>Hi, <strong>{displayName || user.email}</strong></span>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 8 }}>Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
