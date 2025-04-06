
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, XCircle } from 'lucide-react';

interface SessionHeaderProps {
  categoryName: string;
  level: string | number;
  timeRemaining: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onEndInterview: () => void;
  formatTime: (seconds: number) => string;
}

const SessionHeader = ({
  categoryName,
  level,
  timeRemaining,
  currentQuestionIndex,
  totalQuestions,
  onEndInterview,
  formatTime
}: SessionHeaderProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-xl font-bold text-interview-text">
            {categoryName || "Technical"} Interview
          </h1>
          <span className="ml-3 px-3 py-1 bg-interview-primary/10 text-interview-primary text-xs font-medium rounded-full">
            Level {level || 1}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">Time Left:</span>
            <span className={`ml-1 text-sm font-medium ${timeRemaining < 15 ? 'text-red-500' : 'text-gray-700'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <div>
            <Progress value={progress} className="w-28 h-2" />
            <span className="text-xs text-gray-500 mt-1 block">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={onEndInterview}
          >
            <XCircle className="h-4 w-4 mr-1" />
            End
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SessionHeader;
