
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  context: string;
}

const QuestionCard = ({ question, context }: QuestionCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Info className="h-4 w-4 mr-1" />
          <span>Interview Question</span>
        </div>
        <h2 className="text-xl font-medium text-interview-text mb-4">
          {question}
        </h2>
        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
          <span className="font-medium">Context:</span> {context}
        </p>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
