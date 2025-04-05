
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock interview questions based on software engineering role
const mockQuestions = [
  {
    id: 1,
    question: "Tell me about yourself and your experience as a software engineer.",
    context: "This is a common opening question to get to know your background and experience."
  },
  {
    id: 2,
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    context: "The interviewer wants to understand your problem-solving abilities and resilience."
  },
  {
    id: 3,
    question: "How do you approach testing and debugging in your development process?",
    context: "This assesses your understanding of quality assurance practices."
  },
  {
    id: 4,
    question: "Give an example of a time when you had to learn a new technology quickly.",
    context: "The interviewer is evaluating your adaptability and learning capacity."
  },
  {
    id: 5,
    question: "How do you prioritize tasks when working on multiple projects with tight deadlines?",
    context: "This question evaluates your time management and prioritization skills."
  }
];

// Mock feedback responses
const mockFeedbacks = [
  {
    id: 1,
    feedback: "Your response was well-structured and provided specific examples from your experience. Good use of the STAR method (Situation, Task, Action, Result). Consider adding more quantitative results to strengthen your answer.",
    strengths: [
      "Clear communication",
      "Good use of specific examples",
      "Structured response"
    ],
    improvements: [
      "Add more quantitative results",
      "Slightly more concise introduction"
    ],
    rating: 85
  },
  {
    id: 2,
    feedback: "You effectively highlighted the challenges faced and your problem-solving approach. Your answer could be improved by more clearly explaining the specific actions you took and emphasizing your individual contribution to the team's success.",
    strengths: [
      "Good problem description",
      "Honest about challenges",
      "Positive outcome emphasis"
    ],
    improvements: [
      "More detail on specific actions taken",
      "Emphasize your personal contribution more"
    ],
    rating: 78
  },
  {
    id: 3,
    feedback: "Your answer showed good technical knowledge about testing methodologies. However, it would be stronger with more specific examples of how you've implemented these practices in real projects. Consider mentioning specific tools and frameworks you've used.",
    strengths: [
      "Strong technical knowledge",
      "Comprehensive overview of testing types",
      "Logical explanation"
    ],
    improvements: [
      "Include specific project examples",
      "Mention specific testing tools and frameworks"
    ],
    rating: 82
  },
  {
    id: 4,
    feedback: "Great example of learning agility. Your response clearly outlined the steps you took to master a new technology. To improve, you could mention how this experience changed your approach to learning new technologies in general.",
    strengths: [
      "Well-structured learning process",
      "Demonstrated persistence",
      "Clear outcomes"
    ],
    improvements: [
      "Mention impact on future approach to learning",
      "Add more detail about specific challenges overcome"
    ],
    rating: 88
  },
  {
    id: 5,
    feedback: "Your answer showed good organizational skills and prioritization methods. To strengthen your response, consider discussing how you communicate priorities with stakeholders and handle expectation management when all deadlines can't be met.",
    strengths: [
      "Clear prioritization framework",
      "Practical approach to time management",
      "Task delegation awareness"
    ],
    improvements: [
      "Discuss stakeholder communication more",
      "Address expectation management"
    ],
    rating: 80
  }
];

export const useInterviewQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<typeof mockFeedbacks[0] | null>(null);
  
  // Use questions from location state or fallback to mockQuestions
  const questions = location.state?.questions || mockQuestions;
  const currentQuestion = questions[currentQuestionIndex] || mockQuestions[currentQuestionIndex];
  
  // Handle submission of response
  const handleSubmitResponse = () => {
    if (!userResponse.trim()) {
      toast({
        title: "Empty response",
        description: "Please provide an answer before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to get feedback
    setTimeout(() => {
      // If we have mockFeedbacks for this index, use it, otherwise generate a generic one
      if (mockFeedbacks[currentQuestionIndex]) {
        setFeedback(mockFeedbacks[currentQuestionIndex]);
      } else {
        // Generate a generic feedback
        setFeedback({
          id: 999,
          feedback: "Your answer shows understanding of the topic. Consider adding more specific examples to strengthen your response.",
          strengths: [
            "Good overall understanding",
            "Logical structure"
          ],
          improvements: [
            "Add more specific examples",
            "Expand on technical details"
          ],
          rating: 75
        });
      }
      setIsSubmitting(false);
    }, 2000);
  };
  
  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserResponse('');
      setFeedback(null);
      return true; // More questions available
    } else {
      // End of interview
      return false; // No more questions
    }
  };
  
  // End the interview and navigate to results
  const handleEndInterview = () => {
    navigate('/dashboard');
  };

  return {
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
  };
};
