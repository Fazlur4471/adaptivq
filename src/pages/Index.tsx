import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Users, BarChart3, Building, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 animated-gradient-bg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ace Your Next Interview with <span className="text-white">AI-Powered Practice</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Realistic interview simulations with personalized feedback to help you land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-interview-primary hover:bg-gray-100"
              onClick={handleGetStarted}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/10" 
              onClick={() => navigate('/features')}
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-16 bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm font-medium">Mock Interview Session</span>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <p className="text-interview-primary font-medium mb-2">Interviewer (AI):</p>
                <p className="bg-gray-50 p-4 rounded-lg text-gray-800">
                  Can you tell me about a challenging project you worked on and how you overcame obstacles?
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-2">You:</p>
                <div className="flex items-center">
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-800 w-full relative overflow-hidden">
                    <span className="inline-block whitespace-nowrap animate-typing overflow-hidden border-r-2 border-gray-800 animate-cursor-blink pr-1">
                      In my previous role, I was tasked with implementing a new...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-interview-text mb-4">Why Choose InterviewPro AI?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform uses advanced AI to provide realistic interview experiences and personalized feedback.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-interview-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6 text-interview-primary" />
              </div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">AI-Powered Questions</h3>
              <p className="text-gray-600">
                Our AI generates tailored questions based on your experience level, target role, and industry.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-interview-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-interview-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Personalized Feedback</h3>
              <p className="text-gray-600">
                Get detailed feedback on your responses, highlighting strengths and areas for improvement.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-interview-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-interview-accent" />
              </div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your improvement over time with detailed analytics and performance metrics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-interview-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-interview-primary" />
              </div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Company-Specific Prep</h3>
              <p className="text-gray-600">
                Practice with questions frequently asked by your target companies and roles.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-interview-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-interview-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Realistic Simulations</h3>
              <p className="text-gray-600">
                Experience interview scenarios that closely mirror real-world interviews.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-interview-accent/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="h-6 w-6 text-interview-accent" />
              </div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Continuous Learning</h3>
              <p className="text-gray-600">
                Our AI adapts and evolves to provide increasingly challenging questions as you improve.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-interview-text mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get started with InterviewPro AI in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-interview-primary text-white flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and tell us about your experience, target role, and companies you're interested in.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-interview-secondary text-white flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Practice Interviews</h3>
              <p className="text-gray-600">
                Engage in AI-powered mock interviews tailored to your specific needs and goals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-interview-accent text-white flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-interview-text mb-3">Review & Improve</h3>
              <p className="text-gray-600">
                Get personalized feedback, track your progress, and continuously refine your interview skills.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Button size="lg" className="bg-interview-primary hover:bg-interview-primary/90" asChild>
              <Link to="/signup">
                Start Practicing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-interview-text mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from people who have successfully landed their dream jobs with InterviewPro AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-interview-primary/20 flex items-center justify-center">
                  <span className="text-interview-primary font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-medium text-interview-text">Jessica S.</h4>
                  <p className="text-sm text-gray-500">Software Engineer at Google</p>
                </div>
              </div>
              <p className="text-gray-600">
                "InterviewPro AI helped me prepare for my Google interview with incredibly realistic technical questions. The feedback was spot-on and highlighted areas I needed to improve."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-interview-secondary/20 flex items-center justify-center">
                  <span className="text-interview-secondary font-bold">MK</span>
                </div>
                <div>
                  <h4 className="font-medium text-interview-text">Michael K.</h4>
                  <p className="text-sm text-gray-500">Product Manager at Amazon</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The personalized feedback on my behavioral interview responses was invaluable. I saw significant improvement in my ability to structure and deliver compelling answers."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-interview-accent/20 flex items-center justify-center">
                  <span className="text-interview-accent font-bold">RL</span>
                </div>
                <div>
                  <h4 className="font-medium text-interview-text">Rachel L.</h4>
                  <p className="text-sm text-gray-500">Data Scientist at Microsoft</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As someone who gets nervous during interviews, the realistic practice sessions helped me build confidence. The AI's questions were surprisingly similar to my actual interviews!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-interview-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their interview skills and boosted their confidence with InterviewPro AI.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-interview-primary hover:bg-gray-100"
            onClick={handleGetStarted}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
