
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, ThumbsDown, Info } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: {
    id: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    rating: number;
  };
  userResponse: string;
  onNextQuestion: () => void;
}

const FeedbackDisplay = ({ feedback, userResponse, onNextQuestion }: FeedbackDisplayProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Feedback on Your Response</h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Was this feedback helpful?</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 mr-2">
              <ThumbsUp className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ThumbsDown className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Your Answer:</h4>
              <p className="text-gray-700">{userResponse}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h4 className="font-medium mb-3">AI Feedback:</h4>
              <p className="text-gray-700 mb-6">{feedback.feedback}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-green-600 mb-2">Strengths</h5>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="bg-green-100 text-green-600 p-1 rounded-full mr-2 flex-shrink-0">
                          <ThumbsUp className="h-3 w-3" />
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-amber-600 mb-2">Areas for Improvement</h5>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="bg-amber-100 text-amber-600 p-1 rounded-full mr-2 flex-shrink-0">
                          <Info className="h-3 w-3" />
                        </span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-4 text-center">Response Rating</h4>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={feedback.rating >= 80 ? "#22C55E" : feedback.rating >= 60 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="3"
                    strokeDasharray={`${feedback.rating}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{feedback.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 text-center mb-6">
                {feedback.rating >= 90 ? "Excellent!" : 
                  feedback.rating >= 80 ? "Very Good" : 
                  feedback.rating >= 70 ? "Good" : 
                  feedback.rating >= 60 ? "Satisfactory" : "Needs Improvement"}
              </p>
              
              <Button 
                onClick={onNextQuestion}
                className="w-full bg-interview-primary hover:bg-interview-primary/90"
              >
                Next Question
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
