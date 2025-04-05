import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { generateQuestions } from '@/utils/questionGenerator';

interface Question {
  id: number;
  question: string;
  difficulty: string;
  timeLimit: number;
}

const SubjectQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const categoryId = location.state?.category || '';
  const categoryTitle = location.state?.categoryTitle || '';
  
  const questionsPerPage = 10;
  const totalPages = Math.ceil(30 / questionsPerPage);
  
  useEffect(() => {
    if (!categoryId) {
      toast({
        title: "Missing category",
        description: "Please select a category from the categories page.",
        variant: "destructive"
      });
      navigate('/categories');
      return;
    }
    
    // Generate 30 questions for the selected category
    setLoading(true);
    
    const generatedQuestions = generateQuestions(categoryId, categoryTitle, 30);
    setQuestions(generatedQuestions);
    setLoading(false);
  }, [categoryId, categoryTitle, navigate, toast]);
  
  const handleStartQuiz = (questionSet: Question[]) => {
    navigate('/interview/session', { 
      state: { 
        level: 1,
        category: categoryTitle || getCategoryName(categoryId),
        questions: questionSet,
      } 
    });
  };
  
  // Generate questions based on category and count
  const generateQuestions = (category: string, categoryName: string, count: number) => {
    const questions: Question[] = [];
    
    // Define difficulty levels based on question index
    const getDifficulty = (index: number) => {
      if (index < 10) return "Easy";
      if (index < 20) return "Medium";
      return "Hard";
    };
    
    for (let i = 1; i <= count; i++) {
      questions.push({
        id: i,
        question: getQuestionPrompt(category, i),
        difficulty: getDifficulty(i),
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
  const getQuestionPrompt = (category: string, index: number) => {
    const prompts: Record<string, string[]> = {
      dsa: [
        'Explain the time complexity of different sorting algorithms.',
        'Implement a stack using arrays.',
        'Solve this recursive problem.',
        'Describe the working of binary search.',
        'Compare linked lists vs arrays.',
        'Implement a queue using two stacks.',
        'Solve this dynamic programming problem.',
        'Analyze the efficiency of hash tables.',
        'Design an algorithm to solve this graph problem.',
        'Implement a balanced binary search tree.',
        'Explain the concept of divide and conquer.',
        'Implement a priority queue.',
        'Optimize this algorithm for better space complexity.',
        'Describe the working of merge sort.',
        'Compare different tree traversal algorithms.',
        'Implement a trie data structure.',
        'Solve this greedy algorithm problem.',
        'Explain amortized analysis in data structures.',
        'Design a solution for this backtracking problem.',
        'Implement an efficient algorithm for string matching.',
        'Describe the concept of dynamic programming.',
        'Solve this problem using breadth-first search.',
        'Implement depth-first search for graph traversal.',
        'Explain the concept of NP-completeness.',
        'Design an efficient algorithm for this optimization problem.',
        'Compare different algorithmic approaches for this problem.',
        'Implement a disjoint set data structure.',
        'Solve this advanced recursion problem.',
        'Describe the concept of memoization.',
        'Implement an efficient solution for this hard problem.'
      ],
      dbms: [
        'Explain the concept of normalization.',
        'Write a simple SQL query for this scenario.',
        'Describe ACID properties in database transactions.',
        'Explain database indexing.',
        'Compare SQL vs NoSQL databases.',
        'Design a database schema for this scenario.',
        'Optimize this complex SQL query.',
        'Explain database sharding strategies.',
        'Implement a transaction with proper isolation.',
        'Design a distributed database solution.',
        'Explain the concept of database locking mechanisms.',
        'Write a stored procedure for this scenario.',
        'Describe the CAP theorem in distributed databases.',
        'Implement a trigger in SQL.',
        'Compare different database isolation levels.',
        'Explain database replication strategies.',
        'Design a solution for handling database failures.',
        'Describe query optimization techniques.',
        'Implement a solution for database concurrency control.',
        'Explain the concept of materialized views.',
        'Design a data warehouse schema for this scenario.',
        'Compare OLTP and OLAP systems.',
        'Implement database partitioning for better performance.',
        'Describe database backup and recovery strategies.',
        'Explain the concept of database normalization forms.',
        'Design an efficient database index for this scenario.',
        'Compare different database join algorithms.',
        'Implement a solution for database security.',
        'Describe the pros and cons of denormalization.',
        'Explain advanced SQL concepts for complex queries.'
      ],
      cn: [
        'Explain the OSI model layers.',
        'Describe the TCP/IP protocol stack.',
        'Compare TCP and UDP protocols.',
        'Explain how IP addressing works.',
        'Describe the DNS resolution process.',
        'Explain how HTTPS encryption works.',
        'Troubleshoot this network connectivity issue.',
        'Design a secure network architecture.',
        'Explain load balancing techniques.',
        'Implement a routing algorithm.',
        'Describe the concept of subnetting.',
        'Compare different network topologies.',
        'Explain how firewalls protect networks.',
        'Implement a solution for network congestion control.',
        'Describe the working of DHCP protocol.',
        'Compare IPv4 and IPv6 addressing schemes.',
        'Explain the concept of NAT and PAT.',
        'Design a solution for network redundancy.',
        'Describe how VPNs ensure secure communication.',
        'Implement a solution for quality of service.',
        'Explain the concept of socket programming.',
        'Compare different routing protocols.',
        'Describe how wireless networks operate.',
        'Implement a solution for network security.',
        'Explain the working of SMTP protocol.',
        'Design a solution for network monitoring.',
        'Compare different WAN technologies.',
        'Describe how CDNs improve network performance.',
        'Explain the concept of software-defined networking.',
        'Implement a solution for network virtualization.'
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
        'Design an efficient I/O scheduling system.',
        'Explain the concept of process synchronization.',
        'Compare different memory management techniques.',
        'Describe how context switching works.',
        'Implement a solution for the producer-consumer problem.',
        'Explain the concept of thrashing in operating systems.',
        'Design a solution for deadlock detection and recovery.',
        'Compare monolithic vs microkernel architectures.',
        'Describe how system calls work in operating systems.',
        'Implement a solution for disk scheduling algorithms.',
        'Explain the concept of memory segmentation.',
        'Design a solution for process communication.',
        'Compare different file access methods.',
        'Describe how boot process works in operating systems.',
        'Implement a solution for memory protection.',
        'Explain the concept of demand paging.',
        'Design an efficient process scheduling algorithm.',
        'Compare different operating system types.',
        'Describe how virtual machines work.',
        'Explain the concept of multithreading.',
        'Implement a solution for resource allocation.'
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
        'Answer this statistical inference question.',
        'Calculate the answer to this permutation problem.',
        'Solve this problem involving profit and loss.',
        'Find the solution to this number series problem.',
        'Answer this question involving ratios and proportions.',
        'Solve this problem involving percentages.',
        'Calculate the answer to this compound interest question.',
        'Find the pattern in this complex sequence.',
        'Solve this problem involving mixtures and allegations.',
        'Answer this question involving probability distributions.',
        'Calculate the solution to this problem involving time and work.',
        'Solve this analytical reasoning problem.',
        'Find the answer to this problem involving pipes and cisterns.',
        'Solve this question involving speed, time, and distance.',
        'Answer this problem involving sets and Venn diagrams.',
        'Calculate the solution to this problem involving averages.',
        'Solve this problem involving clocks and calendars.',
        'Find the answer to this question involving logarithms.',
        'Solve this problem involving progressions.',
        'Answer this question involving coordinate geometry.',
        'Calculate the solution to this advanced probability problem.'
      ],
      personality: [
        'Describe how you handle stress in the workplace.',
        'Explain your approach to team conflicts.',
        'Describe your communication style.',
        'How do you prioritize tasks when overwhelmed?',
        'Give an example of leadership in a difficult situation.',
        'How would you handle a disagreement with your manager?',
        'Describe a situation where you failed and what you learned.',
        'How do you give constructive feedback to peers?',
        'Describe your approach to leading a team through change.',
        'How do you maintain work-life balance in high-pressure situations?',
        'Explain how you adapt to rapidly changing priorities.',
        'Describe your approach to mentoring junior team members.',
        'How do you handle situations when you disagree with company policy?',
        'Give an example of how you have resolved a conflict within a team.',
        'How do you approach continuous learning in your profession?',
        'Describe a time when you had to make a difficult ethical decision.',
        'How do you handle receiving negative feedback?',
        'Explain your approach to building relationships with colleagues.',
        'Describe how you manage multiple competing deadlines.',
        'How do you stay motivated during long-term projects?',
        'Explain your strategy for influencing others without formal authority.',
        'How do you approach problem-solving in ambiguous situations?',
        'Describe how you have overcome a significant professional challenge.',
        'How do you handle situations requiring you to step outside your comfort zone?',
        'Explain your approach to decision-making in fast-paced environments.',
        'How do you ensure accountability within a team?',
        'Describe your strategy for managing up effectively.',
        'How do you build trust within diverse teams?',
        'Explain how you balance attention to detail with meeting deadlines.',
        'How do you approach giving difficult feedback to colleagues?'
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
      'Evaluate these different strategies.',
      'Explain the importance of this concept in the industry.',
      'Solve this intermediate-level problem.',
      'Compare the advantages of these methods.',
      'Implement this algorithm efficiently.',
      'Analyze this complex situation.',
      'Design an optimal solution for this challenge.',
      'Optimize this system for better performance.',
      'Troubleshoot this complicated issue.',
      'Architect a scalable system for this requirement.',
      'Evaluate these competing strategies.',
      'Explain the theoretical foundations of this concept.',
      'Solve this advanced problem with constraints.',
      'Compare different paradigms in this domain.',
      'Implement this sophisticated algorithm.',
      'Analyze this scenario with multiple variables.',
      'Design an innovative solution for this problem.',
      'Optimize this critical system component.',
      'Troubleshoot this enterprise-level issue.',
      'Architect a fault-tolerant system for this requirement.',
      'Evaluate these cutting-edge methodologies.'
    ];
    
    // Return a prompt based on the index
    return relevantPrompts[(index - 1) % relevantPrompts.length];
  };
  
  // Get current page questions
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-6 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p>Loading questions...</p>
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
              {categoryTitle || getCategoryName(categoryId)} - Practice Questions
            </h1>
            <p className="text-gray-600 mt-2">
              Master {categoryTitle || getCategoryName(categoryId)} with our comprehensive question set
            </p>
            <div className="mt-4">
              <Badge variant="outline" className="bg-interview-primary/10 text-interview-primary">
                30 Questions
              </Badge>
              <Badge variant="outline" className="bg-interview-secondary/10 text-interview-secondary ml-2">
                60-Second Timer
              </Badge>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Showing {indexOfFirstQuestion + 1}-{Math.min(indexOfLastQuestion, questions.length)} of {questions.length} questions
              </span>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Progress value={(currentPage / totalPages) * 100} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentQuestions.map((question, index) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={
                          question.difficulty === "Easy" ? "bg-green-500" :
                          question.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                        }>
                          {question.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} /> 
                          <span>60 sec</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Question {question.id}</h3>
                      <p className="text-gray-700">{question.question}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <Button 
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={currentPage === i + 1 ? "bg-interview-primary" : ""}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button 
                variant="outline"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-interview-primary hover:bg-interview-primary/90"
              onClick={() => handleStartQuiz(questions.slice(0, 10))}
            >
              Start Practice Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Begin with the first 10 questions. 60-second time limit per question.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubjectQuestions;
