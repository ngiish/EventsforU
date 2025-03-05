import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function Auth({isSignUp: initialIsSignUp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(initialIsSignUp);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(isSignUp? 'Sign Up' : 'Log In', {email, password});
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("User signed up:", userCredential.user );
                alert("Signed up successfully");
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("User logged in:" , userCredential.user);
                alert("Logged in successfully");
            }
        } catch (error) {
            console.error("Auth error:" , error.code, error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="auth">
            <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                />
                <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                />
                <button type='submit'>{isSignUp ? 'Sign Up' : 'Log In'}</button>   
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                Switch to {isSignUp ? 'Log In': 'Sign Up'}
            </button>
        </div>
    )
}
export default Auth;