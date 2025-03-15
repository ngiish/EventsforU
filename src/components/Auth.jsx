import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Auth({ isSignUp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        console.log(isSignUp ? 'Sign Up' : 'Log In', { email, password });
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("User signed up:", userCredential.user);
                navigate('/home');
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("User logged in:", userCredential.user);
                navigate('/home');
            }
        } catch (error) {
            console.error("Auth error:", error.code, error.message);
            setError(error.message);
        }
    };

    return (
        <div className="auth">
            <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="input-field"
                />
                <button type="submit" className="submit-btn">
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Auth;