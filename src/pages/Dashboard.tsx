import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Play, Clock, BarChart2, CheckCircle, BookOpen, 
  Building, Award, Star, ArrowRight, Plus
} from 'lucide-react';
import axios from 'axios';

// Mock data for charts
const performanceData = [
  { date: 'Jan 5', score: 65 },
  { date: 'Jan 12', score: 68 },
  { date: 'Jan 19', score: 72 },
  { date: 'Jan 26', score: 75 },
  { date: 'Feb 2', score: 78 },
  { date: 'Feb 9', score: 82 },
  { date: 'Feb 16', score: 85 },
];

const strengthsData = [
  { category: 'Problem Solving', score: 85 },
  { category: 'Communication', score: 78 },
  { category: 'Technical Skills', score: 92 },
  { category: 'Behavioral', score: 76 },
  { category: 'Situational', score: 82 },
];

// Mock data for recent interviews
const recentInterviews = [
  {
    id: 1,
    role: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    date: '2 days ago',
    score: 82,
    duration: '35 min',
    questions: 12,
  },
  {
    id: 2,
    role: 'UX Designer',
    company: 'Creative Digital',
    date: '1 week ago',
    score: 76,
    duration: '28 min',
    questions: 10,
  },
  {
    id: 3,
    role: 'Product Manager',
    company: 'Innovate AI',
    date: '2 weeks ago',
    score: 70,
    duration: '42 min',
    questions: 15,
  },
];

// Mock data for skills
const skills = [
  { name: 'Technical Knowledge', value: 85 },
  { name: 'Communication', value: 78 },
  { name: 'Problem Solving', value: 92 },
  { name: 'Cultural Fit', value: 76 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState<any[]>([]);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Starting to fetch questions...");
        const response = await axios.get('http://localhost:5000/get_test_questions', {
          params: {
            num_questions: 5,
            category: 'DSA',
            difficulty: 'Easy'
          }
        });
        console.log("Raw API response:", response);
        console.log("Question data received:", response.data);
        
        // Check if response.data is an array with the expected structure
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log("First question example:", response.data[0]);
          setQuestions(response.data);
          
          // Initialize userAnswers state with empty strings for each question
          const initialAnswers = {};
          response.data.forEach(question => {
            initialAnswers[question.question] = '';
          });
          setUserAnswers(initialAnswers);
          console.log("userAnswers initialized:", initialAnswers);
        } else {
          console.error("Response data is not in expected format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  console.log("Questions state changed:", questions);
}, []);

  const handleAnswerChange = (question, answer) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [question]: answer,
    }));
  };

  const submitExam = async () => {
    try {
      console.log("Current questions:", questions);
      console.log("Current userAnswers:", userAnswers);
      
      // Convert answers object to array format the backend expects
      const userAnswersArray = questions.map(q => userAnswers[q.question] || '');
      console.log("Converted userAnswers array:", userAnswersArray);
      
      const response = await axios.post('http://localhost:5000/evaluate_exam', {
        answers: userAnswersArray,
        questions: questions
      });
      console.log("Evaluation response:", response.data);
      setEvaluationResult(response.data);
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };
  console.log("Evaluation Result:", evaluationResult);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-interview-text">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Track your interview progress and skills.</p>
            </div>
            
            <Button className="bg-interview-primary hover:bg-interview-primary/90" asChild>
              <Link to="/interview/new">
                <Play className="mr-2 h-4 w-4" />
                Start New Interview
              </Link>
            </Button>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Interviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-interview-primary mr-2" />
                      <span className="text-2xl font-bold">12</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <BarChart2 className="h-5 w-5 text-interview-secondary mr-2" />
                      <span className="text-2xl font-bold">78%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Questions Answered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-interview-accent mr-2" />
                      <span className="text-2xl font-bold">142</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Study Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-2xl font-bold">8.5 hrs</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>Your interview scoring trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#4F46E5" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Exam Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Practice Exam</CardTitle>
                  <CardDescription>Answer the following questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {questions.length > 0 ? (
                  <>
                    <p className="mb-4">Loaded {questions.length} questions:</p>
                    {questions.map((question, index) => (
                      <div key={index} className="mb-4 p-3 border border-gray-300 rounded">
                        <p className="font-medium">{index + 1}. {question.question || "No question text"}</p>
                        <input
                          type="text"
                          value={userAnswers[question.question] || ''}
                          onChange={(e) => handleAnswerChange(question.question, e.target.value)}
                          className="w-full p-2 border rounded mt-2"
                          placeholder="Type your answer here..."
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p>No questions loaded yet. Status: {questions === null ? "null" : 
                      Array.isArray(questions) ? `Array with ${questions.length} items` : 
                      typeof questions}</p>
                  </div>
                )}
                  <Button onClick={submitExam} className="bg-interview-primary hover:bg-interview-primary/90">
                    Submit Exam
                  </Button>
                </CardContent>
              </Card>
              {/* Evaluation Result Display - ADDED HERE */}
              {Array.isArray(evaluationResult) && evaluationResult.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-semibold text-green-700">Evaluation Result</h2>
                  {evaluationResult.map((item, index) => (
                    <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-md shadow-sm">
                      <p className="text-sm font-medium text-gray-800">
                        <span className="text-gray-600">Q{index + 1}:</span> {item.question}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-600">Your Answer:</span> {item.user_answer}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-600">Evaluation:</span> {item.evaluation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {/* Recent Interviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Interviews</CardTitle>
                    <CardDescription>Your latest practice sessions</CardDescription>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/interviews">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentInterviews.map((interview) => (
                      <div key={interview.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          <div className="w-10 h-10 rounded-full bg-interview-primary/10 flex items-center justify-center">
                            <Building className="h-5 w-5 text-interview-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-interview-text">{interview.role}</h4>
                            <p className="text-sm text-gray-500">{interview.company}</p>
                            <p className="text-xs text-gray-400 mt-1">{interview.date} • {interview.duration} • {interview.questions} questions</p>
                          </div>
                        </div>
                        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{interview.score}%</span>
                          </div>
                          <Button size="sm" variant="ghost" className="text-interview-primary" asChild>
                            <Link to={`/interview/${interview.id}`}>
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Interviews Tab */}
            <TabsContent value="interviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle>Your Interview Sessions</CardTitle>
                      <CardDescription>All your practice interviews</CardDescription>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-interview-primary hover:bg-interview-primary/90" asChild>
                      <Link to="/interview/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Interview
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[...recentInterviews, ...recentInterviews].map((interview, index) => (
                      <div key={`${interview.id}-${index}`} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          <div className="w-10 h-10 rounded-full bg-interview-primary/10 flex items-center justify-center">
                            <Building className="h-5 w-5 text-interview-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-interview-text">{interview.role}</h4>
                            <p className="text-sm text-gray-500">{interview.company}</p>
                            <p className="text-xs text-gray-400 mt-1">{interview.date} • {interview.duration} • {interview.questions} questions</p>
                          </div>
                        </div>
                        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{interview.score}%</span>
                          </div>
                          <Button size="sm" variant="ghost" className="text-interview-primary" asChild>
                            <Link to={`/interview/${interview.id}`}>
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Assessment</CardTitle>
                    <CardDescription>Your strengths and areas for improvement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {skills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Strengths Analysis</CardTitle>
                    <CardDescription>Breakdown of your interview strengths</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={strengthsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" fill="#A855F7" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Recommendations</CardTitle>
                  <CardDescription>AI-powered suggestions to improve your interview skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                      <h4 className="font-medium text-interview-text flex items-center">
                        <Award className="h-5 w-5 text-interview-primary mr-2" />
                        Behavioral Questions
                      </h4>
                      <p className="text-gray-600 mt-2">
                        Practice structuring your responses using the STAR method (Situation, Task, Action, Result) for more impactful answers.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-purple-50 border-purple-100">
                      <h4 className="font-medium text-interview-text flex items-center">
                        <Award className="h-5 w-5 text-interview-secondary mr-2" />
                        Technical Demonstrations
                      </h4>
                      <p className="text-gray-600 mt-2">
                        When explaining technical concepts, try to use more real-world examples to illustrate your understanding. This makes your explanations more relatable.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                      <h4 className="font-medium text-interview-text flex items-center">
                        <Award className="h-5 w-5 text-green-500 mr-2" />
                        Communication Skills
                      </h4>
                      <p className="text-gray-600 mt-2">
                        You tend to speak quickly when discussing topics you're passionate about. Try to maintain a steady pace throughout your responses for better clarity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

           {/* Evaluations Section */}
           {evaluations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Results</CardTitle>
                  <CardDescription>Review your performance on the practice exam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {evaluations.map((evaluation) => (
                    <div key={evaluation.question} className="p-4 border rounded">
                      <p className="font-medium">{evaluation.question}</p>
                      <p>Your Answer: {evaluation.user_answer}</p>
                      <p>Evaluation: {evaluation.evaluation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
