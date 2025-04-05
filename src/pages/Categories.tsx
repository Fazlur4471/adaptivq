
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InterviewCategories from '@/components/InterviewCategories';

const CategoriesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-interview-text">Interview Preparation Categories</h1>
            <p className="text-gray-600 mt-2">
              Choose a category to prepare for your technical interviews
            </p>
          </div>
          
          <InterviewCategories />
          
          <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h2 className="text-lg font-medium text-blue-800 mb-2">How it works</h2>
            <ol className="list-decimal pl-5 space-y-2 text-blue-700">
              <li>Select a category you want to practice</li>
              <li>Progress through increasingly difficult levels</li>
              <li>Answer questions within the time limit (60 seconds per question)</li>
              <li>Receive feedback on your answers to improve</li>
              <li>Track your progress and master technical interviews!</li>
            </ol>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;
