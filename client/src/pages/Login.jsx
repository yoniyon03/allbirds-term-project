import { useState } from "react";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "로그인에 실패했습니다.");
      setStatus({
        type: "success",
        message: data.message || "로그인에 성공했습니다.",
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <h1 className="title">로그인</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="sr-only">이메일 주소</span>
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="sr-only">비밀번호</span>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <div className="help-row">
            <button type="button" className="ghost-link">
              비밀번호를 잊으셨나요?
            </button>
          </div>
          <button className="submit" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
          {status && (
            <div className={`status ${status.type}`}>{status.message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
