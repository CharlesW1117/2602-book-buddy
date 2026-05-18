import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/useAuth";


export default function Register() {
  const { register } = useAuth();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ firstname, lastname, email, password });
      navigate("/account");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      <div>
        <label>First name</label><br />
        <input value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
      </div>
      <div>
        <label>Last name</label><br />
        <input value={lastname} onChange={(e) => setLastname(e.target.value)} required />
      </div>
      <div>
        <label>Email</label><br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading} style={{ marginTop: 12 }}>Register</button>
    </form>
  );
}
