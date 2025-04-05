
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-6">
        <SignupForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
