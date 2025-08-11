import { useState } from "react"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate, useLocation } from "react-router-dom"
import "../Auth.scss"

function Auth({ isSignUp }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Decide mode: use prop when given, otherwise infer from URL (/signup)
  const modeIsSignUp =
    typeof isSignUp === "boolean" ? isSignUp : /signup/i.test(location.pathname || "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    console.log(modeIsSignUp ? "Sign Up" : "Log In", { email, password })
    try {
      if (modeIsSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log("User signed up:", userCredential.user)
        navigate("/home")
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log("User logged in:", userCredential.user)
        navigate("/home")
      }
    } catch (error) {
      console.error("Auth error:", error.code, error.message)
      setError(error.message)
    }
  }

  return (
    <div className="auth-page">
      {/* Left column: form side */}
      <section className="auth-left">
        {/* LOGIN badge (visible) */}
        <div className="login-badge" aria-hidden="true">
          <span className="badge-icon"></span>
          <span className="badge-text">{modeIsSignUp ? "SIGN UP" : "LOGIN"}</span>
        </div>

        <div className="auth">
          {/* Keep heading for a11y */}
          <h2 className="sr-only">{modeIsSignUp ? "Sign Up" : "Log In"}</h2>

          <form onSubmit={handleSubmit}>
            <label className="field">
              <span className="label-text">Your Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </label>

            <label className="field">
              <span className="label-text">Your Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                className="input-field"
              />
            </label>

            <button type="submit" className="submit-btn">
              {modeIsSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <div className="helper-links">
            {modeIsSignUp ? (
              <p>
                Already have an account? <a href="/login">Log in instead</a>
              </p>
            ) : (
              <p>
                {"Don't have an account yet? "}
                <a href="/signup">Signup here</a>
              </p>
            )}
            <p>
              Forgotten your password? <a href="/reset">Click here to reset it.</a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero side */}
      <section className="auth-right" aria-label="EventsForU brand panel">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="logo-tile">
            <div className="logo-mark"></div>
            <div className="logo-name">EventsForU</div>
          </div>

          <div className="hero-text">
            <h3 className="hero-title">EventsForU</h3>
            <p className="hero-subtitle">Your Events, Your Way</p>
            <p className="hero-tagline">Plan it. Manage it. Like a Pro.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Auth
