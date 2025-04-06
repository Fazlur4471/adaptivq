
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  initiatePhoneSignIn: (phoneNumber: string) => Promise<ConfirmationResult>;
  confirmPhoneSignIn: (verificationCode: string, confirmationResult: ConfirmationResult, redirectPath?: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Convert Firebase User to our UserData format
  const formatUser = (user: User | null): UserData | null => {
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber
    };
  };

  useEffect(() => {
    // Listen for auth state changes
    console.log("Setting up auth state listener");
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      setCurrentUser(formatUser(user));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign in with Google
  const signInWithGoogle = async (redirectPath = '/dashboard') => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Successfully signed in with Google!",
        description: "Welcome to InterviewPro AI."
      });
      navigate(redirectPath);
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Could not sign in with Google. Please try again."
      });
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful!",
        description: "Welcome back to InterviewPro AI."
      });
      // Navigation handled in Login component
    } catch (error) {
      console.error("Email sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again."
      });
      throw error;
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with name - fix string template
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      toast({
        title: "Account created!",
        description: "You have successfully signed up for InterviewPro AI."
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Email sign-up error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "There was a problem with your signup. Please try again."
      });
      throw error;
    }
  };

  // Initialize phone sign in
  const initiatePhoneSignIn = async (phoneNumber: string) => {
    try {
      // Create invisible reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
      
      // Request OTP
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error("Phone sign-in initialization error:", error);
      toast({
        variant: "destructive",
        title: "Phone verification failed",
        description: "Could not send verification code. Please try again."
      });
      throw error;
    }
  };

  // Confirm phone sign in with OTP
  const confirmPhoneSignIn = async (verificationCode: string, confirmationResult: ConfirmationResult, redirectPath = '/dashboard') => {
    try {
      await confirmationResult.confirm(verificationCode);
      toast({
        title: "Phone verification successful!",
        description: "You are now signed in."
      });
      navigate(redirectPath);
    } catch (error) {
      console.error("Phone verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid verification code. Please try again."
      });
      throw error;
    }
  };

  // Log out
  const logOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging out. Please try again."
      });
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password."
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: "Could not send password reset email. Please try again."
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    initiatePhoneSignIn,
    confirmPhoneSignIn,
    logOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
