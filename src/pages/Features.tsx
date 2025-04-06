
import { ArrowRight, Check, Shield, Zap, Clock, BarChart3, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-interview-primary/10">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-interview-text mb-6 leading-tight">
              Advanced Features for <span className="text-interview-primary">Interview Success</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Our AI-powered platform provides all the tools you need to prepare, practice, and perfect your interview skills.
            </p>
            <Button 
              size="lg" 
              className="bg-interview-primary hover:bg-interview-primary/90"
              asChild
            >
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-interview-text mb-4">Key Features</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Everything you need to excel in your next interview
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-interview-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-interview-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-interview-text mb-4">AI Interview Simulations</h3>
                <p className="text-gray-600 mb-6">
                  Practice with our AI interviewer that adapts to your responses and provides realistic interview experiences.
                </p>
                <ul className="space-y-3">
                  {["Realistic scenarios", "Role-specific questions", "Adaptive difficulty"].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-interview-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-interview-secondary" />
                </div>
                <h3 className="text-2xl font-semibold text-interview-text mb-4">Detailed Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Track your progress over time with comprehensive performance metrics and improvement suggestions.
                </p>
                <ul className="space-y-3">
                  {["Performance trends", "Strength identification", "Improvement areas"].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-interview-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-interview-accent" />
                </div>
                <h3 className="text-2xl font-semibold text-interview-text mb-4">Personalized Feedback</h3>
                <p className="text-gray-600 mb-6">
                  Receive tailored feedback on your responses to help you refine your answers and communication style.
                </p>
                <ul className="space-y-3">
                  {["Content analysis", "Delivery feedback", "Custom improvement plans"].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature Comparison */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-interview-text mb-4">How We Compare</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See why InterviewPro AI stands out from traditional interview preparation
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                <thead>
                  <tr>
                    <th className="p-6 text-left text-lg font-semibold text-interview-text border-b">Features</th>
                    <th className="p-6 text-center text-lg font-semibold text-interview-text border-b">InterviewPro AI</th>
                    <th className="p-6 text-center text-lg font-semibold text-interview-text border-b">Traditional Prep</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {feature: "Personalized Questions", us: true, them: false},
                    {feature: "Real-time Feedback", us: true, them: false},
                    {feature: "Progress Tracking", us: true, them: false},
                    {feature: "Unlimited Practice Sessions", us: true, them: false},
                    {feature: "Industry-specific Questions", us: true, them: true},
                    {feature: "Technical Skill Assessment", us: true, them: true},
                  ].map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-6 text-gray-700">{row.feature}</td>
                      <td className="p-6 text-center">
                        {row.us ? 
                          <Check className="h-6 w-6 text-green-500 mx-auto" /> : 
                          <div className="h-6 w-6 rounded-full border-2 border-red-500 mx-auto" />
                        }
                      </td>
                      <td className="p-6 text-center">
                        {row.them ? 
                          <Check className="h-6 w-6 text-green-500 mx-auto" /> : 
                          <div className="h-6 w-6 rounded-full border-2 border-red-500 mx-auto" />
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-interview-text mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about our platform
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does the AI interview simulator work?",
                    answer: "Our AI interview simulator uses advanced language models to generate realistic interview questions based on your target role, industry, and experience level. It analyzes your responses in real-time and provides feedback on content, delivery, and areas for improvement."
                  },
                  {
                    question: "Is InterviewPro suitable for technical interviews?",
                    answer: "Yes! InterviewPro supports a wide range of interview types, including technical interviews for software development, data science, engineering, and other technical roles. The platform can assess your technical knowledge and problem-solving approach."
                  },
                  {
                    question: "How accurate is the AI feedback?",
                    answer: "Our AI feedback system has been trained on thousands of real interview scenarios and is continuously improved based on expert input. While no AI system is perfect, our users report that the feedback closely aligns with what they later experienced in real interviews."
                  },
                  {
                    question: "Can I use InterviewPro for specific companies?",
                    answer: "Absolutely! You can specify target companies, and our system will tailor questions based on known interview patterns from those organizations. This helps you prepare for company-specific interview styles and question types."
                  },
                  {
                    question: "How many practice sessions can I have?",
                    answer: "Our standard plan includes unlimited practice sessions, allowing you to prepare as much as needed before your actual interview."
                  }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-interview-text font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600 pt-2">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 bg-interview-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Interview Skills?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who landed their dream jobs with InterviewPro AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-interview-primary hover:bg-gray-100"
                asChild
              >
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/dashboard">
                  Explore Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
