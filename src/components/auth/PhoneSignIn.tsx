
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmationResult } from "firebase/auth";
import { Phone, AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PhoneSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseConfigured, setFirebaseConfigured] = useState(true);
  const { initiatePhoneSignIn, confirmPhoneSignIn } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if Firebase API key is configured
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey || apiKey === "YOUR_API_KEY") {
      setFirebaseConfigured(false);
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Phone number required",
        description: "Please enter a valid phone number with country code"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await initiatePhoneSignIn(phoneNumber);
      setConfirmationResult(result);
      setIsCodeSent(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code"
      });
    } catch (error) {
      console.error("Error sending code:", error);
      toast({
        variant: "destructive",
        title: "Failed to send code",
        description: "Please check your phone number and try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || !confirmationResult) {
      toast({
        variant: "destructive",
        title: "Verification code required",
        description: "Please enter the verification code you received"
      });
      return;
    }
    
    const from = location.state?.from || '/dashboard';
    
    setIsLoading(true);
    try {
      await confirmPhoneSignIn(verificationCode, confirmationResult, from);
      toast({
        title: "Phone verification successful",
        description: "You've been successfully signed in"
      });
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid verification code. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!firebaseConfigured) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Firebase configuration missing</AlertTitle>
        <AlertDescription>
          Phone authentication requires valid Firebase API keys. Please set the required environment variables.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      <div id="recaptcha-container"></div>
      
      {!isCodeSent ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Enter your phone number with country code (e.g., +1 for US)
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center gap-2" 
            disabled={isLoading}
          >
            <Phone className="h-4 w-4" />
            {isLoading ? "Sending code..." : "Sign in with Phone"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <InputOTP 
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              className="gap-2 justify-center mb-2"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-gray-500 text-center">
              Enter the 6-digit code sent to your phone
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => setIsCodeSent(false)}
          >
            Change Phone Number
          </Button>
        </form>
      )}
    </div>
  );
};

export default PhoneSignIn;
