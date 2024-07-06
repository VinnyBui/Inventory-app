import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Authorize = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      console.error("Error signing in:", err);
      setError(err.message);
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError(err.message);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='w-1/5 space-y-4'>
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} />
          <Button variant="outline" onClick={signIn}>Login</Button>
          <Button variant="outline" onClick={signUp}>Sign Up</Button>
          <Button variant="outline" onClick={signInWithGoogle}>Sign In With Google</Button>
        </div>
      </div>
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-red-500">{error}</p>
            <button className="mt-2 px-4 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600" onClick={clearError}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Authorize;
