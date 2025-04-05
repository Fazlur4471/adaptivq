
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InterviewIntro from '@/components/interview/InterviewIntro';
import InterviewForm from '@/components/interview/InterviewForm';

const NewInterview = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <InterviewIntro />
          
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide information about the position you're interviewing for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InterviewForm />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewInterview;
