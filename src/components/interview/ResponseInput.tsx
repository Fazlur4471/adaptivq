
import React, { RefObject } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

interface ResponseInputProps {
  userResponse: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  responseInputRef: RefObject<HTMLTextAreaElement>;
}

const ResponseInput = ({ 
  userResponse, 
  onChange, 
  onSubmit, 
  isSubmitting,
  responseInputRef 
}: ResponseInputProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <span>Your Response</span>
        </div>
        <Textarea
          ref={responseInputRef}
          placeholder="Type your answer here..."
          className="min-h-[200px] resize-none"
          value={userResponse}
          onChange={onChange}
          disabled={isSubmitting}
          autoFocus
        />
        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-500">
            Be concise and provide specific examples when possible.
          </p>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-interview-primary hover:bg-interview-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Answer
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseInput;
