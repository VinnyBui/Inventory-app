import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, {
    message: "Password must include at least one uppercase letter, one lowercase letter, and one number.",
  }),
});

const Authorize = () => {
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const checkUserAuthorization = async (user) => {
    const emailDoc = await getDoc(doc(db, "allowedEmails", user.email));
    if (!emailDoc.exists()) {
      throw new Error("Access denied. Please use an authorized account.");
    }
  };

  const handleError = (err) => {
    switch (err.code) {
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      case 'auth/user-not-found':
        setError('No user found with this email.');
        break;
      case 'auth/popup-closed-by-user':
        setError('Popup was closed before completing the sign-in. Please try again.');
        break;
      default:
        setError(err.message);
    }
  };

  const signIn = async (data) => {
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      await checkUserAuthorization(result.user);
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      console.error("Error signing in:", err);
      handleError(err);
      signOut(auth); // Ensure the user is signed out if authorization fails
    }
  };

  const signUp = async (data) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await checkUserAuthorization(result.user);
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      console.error("Error signing up:", err);
      handleError(err);
      signOut(auth); // Ensure the user is signed out if authorization fails
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await checkUserAuthorization(result.user);
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      console.error("Error signing in with Google:", err);
      handleError(err);
      signOut(auth); // Ensure the user is signed out if authorization fails
    }
  };

  const clearError = () => {
    setError(null);
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    clearError();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isSignUp ? signUp : signIn)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type={showPassword ? "text" : "password"} placeholder="Password" />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff  className="h-5 w-5 text-gray-500" />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
        </Form>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={signInWithGoogle}
        >
          Sign In With Google
        </Button>
        <div className="text-center">
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={toggleSignUp}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
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
    </div>
  );
};

export default Authorize;