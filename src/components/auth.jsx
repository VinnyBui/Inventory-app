import React, { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // State for handling errors

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error("Error signing in:", err);
            setError(err.message); // Set error message
        }
    };

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error("Error signing up:", err);
            setError(err.message); // Set error message
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Error signing out:", err);
            setError(err.message); // Set error message
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Error signing in with Google:", err);
            setError(err.message); // Set error message
        }
    };

    const clearError = () => {
        setError(null); // Clear error state
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center h-screen '>
                <div className='w-1/5 space-y-4'>
                    <Input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)} />
                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="outline" onClick={signIn} >Login</Button>
                    <Button variant="outline" onClick={signUp} >Sign Up</Button>
                    <Button variant="outline" onClick={handleSignOut} >Logout</Button>
                    <Button variant="outline" onClick={signInWithGoogle} >Sign In With Google</Button>
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

export default Auth;
