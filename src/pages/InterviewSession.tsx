
import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Custom hooks
import { useInterviewTimer } from '@/hooks/useInterviewTimer';
import { useInterviewQuestions } from '@/hooks/useInterviewQuestions';

// Components
import SessionHeader from '@/components/interview/SessionHeader';
import QuestionCard from '@/components/interview/QuestionCard';
import ResponseInput from '@/components/interview/ResponseInput';
import FeedbackDisplay from '@/components/interview/FeedbackDisplay';
import EndInterviewModal from '@/components/interview/EndInterviewModal';

const InterviewSession = () => {
  const location = useLocation();
  const responseInputRef = useRef<HTMLTextAreaElement>(null);
  const [showEndInterview, setShowEndInterview] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  const {
    currentQuestionIndex,
    questions,
    currentQuestion,
    userResponse,
    setUserResponse,
    isSubmitting,
    feedback,
    handleSubmitResponse,
    handleNextQuestion,
    handleEndInterview
  } = useInterviewQuestions();

  const { timeRemaining, formatTime, resetTimer } = useInterviewTimer({
    initialTime: 60, // 60 seconds per question
    onTimeExpired: handleSubmitResponse,
    isActive: isTimerActive && !feedback && !isSubmitting
  });
  
  // Handle next question button click
  const onNextQuestion = () => {
    const hasMoreQuestions = handleNextQuestion();
    if (hasMoreQuestions) {
      resetTimer();
      setIsTimerActive(true);
      
      // Focus the textarea after state updates
      setTimeout(() => {
        if (responseInputRef.current) {
          responseInputRef.current.focus();
        }
      }, 0);
    } else {
      setShowEndInterview(true);
    }
  };

  // Handle response submission
  const onSubmitResponse = () => {
    setIsTimerActive(false);
    handleSubmitResponse();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SessionHeader
        categoryName={location.state?.category}
        level={location.state?.level || 1}
        timeRemaining={timeRemaining}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onEndInterview={() => setShowEndInterview(true)}
        formatTime={formatTime}
      />
      
      <main className="flex-grow container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <QuestionCard 
            question={currentQuestion.question} 
            context={currentQuestion.context} 
          />
          
          {!feedback ? (
            <ResponseInput
              userResponse={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              onSubmit={onSubmitResponse}
              isSubmitting={isSubmitting}
              responseInputRef={responseInputRef}
            />
          ) : (
            <FeedbackDisplay
              feedback={feedback}
              userResponse={userResponse}
              onNextQuestion={onNextQuestion}
            />
          )}
        </div>
      </main>
      
      <EndInterviewModal
        isVisible={showEndInterview}
        onCancel={() => setShowEndInterview(false)}
        onConfirm={handleEndInterview}
      />
    </div>
  );
};

export default InterviewSession;
