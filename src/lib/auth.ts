import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "./firebase";

// Extend the Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

/**
 * Initialize reCAPTCHA for phone authentication.
 */
const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA verified");
      },
    });
  }
};

/**
 * Initiate phone sign-in by sending an OTP.
 * @param phoneNumber - User's phone number in E.164 format (e.g., +1234567890)
 * @returns Promise<ConfirmationResult>
 */
export const initiatePhoneSignIn = async (phoneNumber: string): Promise<ConfirmationResult> => {
  setupRecaptcha(); // Ensure reCAPTCHA is set up before sending OTP
  const appVerifier = window.recaptchaVerifier;

  if (!appVerifier) {
    throw new Error("reCAPTCHA is not initialized properly.");
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

/**
 * Confirm OTP and sign in the user.
 * @param verificationCode - The OTP received via SMS
 * @param confirmationResult - The result from initiatePhoneSignIn
 * @param redirectTo - Path to redirect after successful login
 */
export const confirmPhoneSignIn = async (
  verificationCode: string,
  confirmationResult: ConfirmationResult,
  redirectTo: string
) => {
  try {
    const result = await confirmationResult.confirm(verificationCode);
    console.log("User signed in:", result.user);
    
    // Redirect after successful sign-in
    window.location.href = redirectTo;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}; 