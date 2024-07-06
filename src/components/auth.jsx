import React, { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try{
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error("Error signing in:", err);
        };
    };

    const signUp = async () => {
        try{
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error("Error signing up:", err);
        };
    };

    const handleSignOut = async () => {
        try{
            await signOut(auth);
        } catch (err) {
            console.error("Error signing out:", err);
        };
    };

    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        };
    };
    return (
    <>
      <div className='flex flex-col items-center justify-center h-screen '>
        <div className='w-1/5 space-y-4'>
          <Input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)}/>
          <Input 
            type="password" 
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} />
          <Button variant="outline" onClick={signIn} >Login</Button>
          <Button variant="outline" onClick={signUp} >Sign Up</Button>
          <Button variant="outline" onClick={handleSignOut} >Logout</Button>
          <Button variant="outline"onClick={signInWithGoogle} >Sign In With Google</Button>
        </div>
      </div>
    </>
    );
  };
  
  export default Auth;