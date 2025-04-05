
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Star, CheckCircle, Clock, Info, Award } from 'lucide-react';
import { generateQuestions } from '@/utils/questionGenerator';
import { useToast } from '@/hooks/use-toast';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if coming from form or category selection
  const fromForm = location.state?.fromForm;
  const categoryId = location.state?.category || '';
  const categoryTitle = location.state?.categoryTitle || '';
  
  const [levels, setLevels] = useState<any[]>([]);
  const [roadmapTitle, setRoadmapTitle] = useState<string>('Interview Preparation');
  
  useEffect(() => {
    // First check if we have a roadmap in localStorage (from form)
    const storedRoadmap = localStorage.getItem('interviewRoadmap');
    
    if (fromForm && storedRoadmap) {
      try {
        const roadmapData = JSON.parse(storedRoadmap);
        setLevels(roadmapData.levels);
        setRoadmapTitle(`${roadmapData.job} Interview Preparation`);
      } catch (error) {
        console.error("Error parsing roadmap data:", error);
        toast({
          variant: "destructive",
          title: "Error loading roadmap",
          description: "Unable to load your personalized roadmap."
        });
        navigate('/dashboard');
      }
    } 
    // If no form data but has category, generate from category
    else if (categoryId) {
      // Generate levels based on the selected category
      const categoryLevels = [
        {
          title: "Foundation Concepts",
          description: "Basic concepts and fundamentals",
          difficulty: "Easy",
          estimatedTime: 15,
          questionCount: 5,
          questions: generateMockQuestions(categoryId, 5, 'basic')
        },
        {
          title: "Intermediate Applications",
          description: "Applied knowledge and practical examples",
          difficulty: "Medium",
          estimatedTime: 25,
          questionCount: 8,
          questions: generateMockQuestions(categoryId, 8, 'intermediate')
        },
        {
          title: "Advanced Concepts",
          description: "Complex problems and in-depth knowledge",
          difficulty: "Hard",
          estimatedTime: 35,
          questionCount: 10,
          questions: generateMockQuestions(categoryId, 10, 'advanced')
        }
      ];
      
      setLevels(categoryLevels);
      setRoadmapTitle(`${getCategoryName(categoryId)} Interview Preparation`);
    }
    // If neither form data nor category, redirect to dashboard
    else {
      toast({
        variant: "destructive",
        title: "No roadmap data",
        description: "Please select a category or create a custom roadmap."
      });
      navigate('/dashboard');
    }
  }, [categoryId, fromForm, navigate, toast]);

  // Function to generate mock questions based on category and level
  const generateMockQuestions = (category: string, count: number, level: string) => {
    const questions = [];
    const categoryName = getCategoryName(category);
    
    for (let i = 1; i <= count; i++) {
      questions.push({
        id: i,
        question: `${level.charAt(0).toUpperCase() + level.slice(1)} ${categoryName} question #${i}: ${getQuestionPrompt(category, level, i)}`,
        type: i % 3 === 0 ? 'behavioral' : 'technical',
        timeLimit: 60 // 60 seconds per question
      });
    }
    
    return questions;
  };
  
  // Helper function to get a category name
  const getCategoryName = (categoryId: string) => {
    switch(categoryId) {
      case 'dsa': return 'Data Structures & Algorithms';
      case 'dbms': return 'Database Management Systems';
      case 'cn': return 'Computer Networks';
      case 'os': return 'Operating Systems';
      case 'aptitude': return 'Aptitude';
      case 'personality': return 'Personality Development';
      default: return categoryId.toUpperCase();
    }
  };
  
  // Helper function to generate relevant question prompts
  const getQuestionPrompt = (category: string, level: string, index: number) => {
    const prompts: Record<string, string[]> = {
      dsa: [
        'Explain time complexity of sorting algorithms.',
        'Implement a stack using arrays.',
        'Solve this problem using recursion.',
        'Describe the working of binary search.',
        'Compare linked lists vs arrays.',
        'Implement a queue using two stacks.',
        'Solve this dynamic programming problem.',
        'Analyze the efficiency of hash tables.',
        'Design an algorithm to solve this graph problem.',
        'Implement a balanced binary search tree.'
      ],
      dbms: [
        'Explain the concept of normalization.',
        'Write a simple SQL query for this scenario.',
        'Describe the difference between ACID and BASE.',
        'Explain database indexing.',
        'Compare SQL vs NoSQL databases.',
        'Design a database schema for this scenario.',
        'Optimize this complex SQL query.',
        'Explain database sharding strategies.',
        'Implement a transaction with proper isolation.',
        'Design a distributed database solution.'
      ],
      cn: [
        'Explain the OSI model layers.',
        'Describe how TCP handshake works.',
        'Compare TCP and UDP protocols.',
        'Explain how IP addressing works.',
        'Describe DNS resolution process.',
        'Explain how HTTPS encryption works.',
        'Troubleshoot this network connectivity issue.',
        'Design a secure network architecture.',
        'Explain load balancing techniques.',
        'Implement a routing algorithm.'
      ],
      os: [
        'Explain process vs thread.',
        'Describe how virtual memory works.',
        'Explain process scheduling algorithms.',
        'Describe how file systems are organized.',
        'Compare different CPU scheduling algorithms.',
        'Explain deadlock prevention strategies.',
        'Implement a simple memory allocation algorithm.',
        'Design a solution for this synchronization problem.',
        'Analyze this page replacement algorithm.',
        'Design an efficient I/O scheduling system.'
      ],
      aptitude: [
        'Solve this logical reasoning puzzle.',
        'Calculate the answer to this probability question.',
        'Solve this data interpretation problem.',
        'Find the pattern in this sequence.',
        'Solve this time and distance problem.',
        'Answer this complex probability scenario.',
        'Solve this combinatorial mathematics problem.',
        'Find the optimal solution to this game theory problem.',
        'Solve this advanced logical reasoning puzzle.',
        'Answer this statistical inference question.'
      ],
      personality: [
        'Describe how you handle stress in workplace.',
        'Explain your approach to team conflicts.',
        'Describe your communication style.',
        'How do you prioritize tasks when overwhelmed?',
        'Give an example of leadership in a difficult situation.',
        'How would you handle a disagreement with your manager?',
        'Describe a situation where you failed and what you learned.',
        'How do you give constructive feedback to peers?',
        'Describe your approach to leading a team through change.',
        'How do you maintain work-life balance in high-pressure situations?'
      ]
    };
    
    // Get relevant prompts for this category or default to generic ones
    const relevantPrompts = prompts[category] || [
      'Explain a fundamental concept.',
      'Solve this basic problem.',
      'Compare these two approaches.',
      'Implement this simple algorithm.',
      'Analyze this scenario.',
      'Design a solution for this problem.',
      'Optimize this implementation.',
      'Troubleshoot this issue.',
      'Architect a system for this requirement.',
      'Evaluate these different strategies.'
    ];
    
    // Return a prompt based on the index
    return relevantPrompts[index % relevantPrompts.length];
  };

  if (levels.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-6 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p>Loading roadmap...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-interview-text">
              {roadmapTitle}
            </h1>
            <p className="text-gray-600 mt-2">
              Master your knowledge with progressive difficulty levels
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryId && (
                <Badge variant="outline" className="bg-interview-primary/10 text-interview-primary">
                  {categoryTitle || getCategoryName(categoryId)}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your Progress</h2>
                <span className="text-sm text-gray-500">0 of {levels.length} levels completed</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            {levels.map((level, index) => (
              <Card key={index} className={index === 0 ? 'border-interview-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Level {index + 1}: {level.title}</CardTitle>
                      <CardDescription>{level.description}</CardDescription>
                    </div>
                    <Badge className={index === 0 ? 'bg-interview-primary' : 'bg-gray-200 text-gray-700'}>
                      {index === 0 ? 'Current' : 'Locked'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      <span>{level.difficulty} Difficulty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      <span>Est. {level.estimatedTime} minutes (60 secs per question)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>{level.questionCount} Questions</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={index === 0 ? 'bg-interview-primary hover:bg-interview-primary/90 w-full' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 w-full cursor-not-allowed'}
                    disabled={index !== 0}
                    onClick={() => {
                      if (index === 0) {
                        navigate('/interview/session', { 
                          state: { 
                            level: index + 1,
                            category: categoryTitle || getCategoryName(categoryId),
                            questions: level.questions
                          } 
                        });
                      }
                    }}
                  >
                    {index === 0 ? 'Start This Level' : 'Complete Previous Levels First'}
                    <ChevronRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <div className="bg-interview-primary/5 border border-interview-primary/20 rounded-lg p-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="bg-interview-primary/10 rounded-full p-2">
                  <Award size={20} className="text-interview-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-interview-text">Complete Your Journey</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Progress through all levels to gain a comprehensive preparation for your interview.
                    Each level builds upon the previous one, with a 60-second time limit for each question.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoadmapPage;
