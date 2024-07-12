import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export const Authorize = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const signInInProgress = useRef(false);

  const signInWithGoogle = async () => {
    if (signInInProgress.current) return;
    signInInProgress.current = true;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const emailDoc = await getDoc(doc(db, "allowedEmails", user.email));
      if (!emailDoc.exists()) {
        await signOut(auth);
        setError("Access denied. Please use an authorized account.");
      } else {
        navigate('/'); // Redirect to Dashboard
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.log("Popup closed by user");
        setError("Popup was closed before completing sign in.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        console.log("Cancelled popup request");
        setError("Multiple sign-in attempts detected. Please try again.");
      } else {
        console.error("Error signing in with Google:", err);
        setError(err.message);
      }
    } finally {
      signInInProgress.current = false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='w-1/5 space-y-4'>
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