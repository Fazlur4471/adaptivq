
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseInterviewTimerProps {
  initialTime: number;
  onTimeExpired: () => void;
  isActive: boolean;
}

export const useInterviewTimer = ({ 
  initialTime, 
  onTimeExpired, 
  isActive 
}: UseInterviewTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const { toast } = useToast();

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer countdown effect
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast({
            title: "Time's up!",
            description: "Your time for this question has ended.",
            variant: "destructive"
          });
          onTimeExpired();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, toast, onTimeExpired]);

  const resetTimer = (newTime = initialTime) => {
    setTimeRemaining(newTime);
  };

  return { timeRemaining, formatTime, resetTimer };
};
