import { useState, type ChangeEvent, type FormEvent } from "react";

function RegTest() {
  interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }

  interface ApiResponse {
    id: string;
    email: string;
  }

  const [form, setForm] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
  });

  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const {error} = await res.json()
        throw new Error(error);
      }

      const data: ApiResponse = await res.json();
      setAnswer("✔️ Success, id for " + data.email + " is: " + data.id);
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setAnswer(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <h2>Registration Test Component</h2>
    <p><i>Run backend user service at localhost:8080.</i></p>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Register"}
        </button>
      </form>

      {/* API response */}
      <p className="mt-4 text-sm">{answer}</p>
    </>
  );
}

export default RegTest;
