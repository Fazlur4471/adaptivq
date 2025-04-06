
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EndInterviewModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const EndInterviewModal = ({ isVisible, onCancel, onConfirm }: EndInterviewModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">End Interview Session?</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to end this interview? Your progress will be saved, but you won't be able to continue this session.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
            >
              End Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EndInterviewModal;
