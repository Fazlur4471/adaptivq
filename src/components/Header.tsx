
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logOut } = useAuth();
  const isLoggedIn = !!currentUser;

  const handleLogout = async () => {
    try {
      await logOut();
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Function to handle "Get Started" navigation based on auth state
  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  // Function to handle "Features" navigation based on auth state
  const handleFeaturesClick = () => {
    navigate('/features');
  };

  return (
    <header className="w-full px-6 py-4 bg-white border-b border-gray-200 shadow-sm fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-interview-primary font-bold text-2xl">InterviewPro</span>
          <span className="bg-interview-primary text-white text-xs px-2 py-1 rounded-full">AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-interview-text hover:text-interview-primary transition-colors">
            Home
          </Link>
          <Link 
            to="/features" 
            className="text-interview-text hover:text-interview-primary transition-colors"
            onClick={handleFeaturesClick}
          >
            Features
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-interview-text hover:text-interview-primary transition-colors">
              Dashboard
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/categories" className="text-interview-text hover:text-interview-primary transition-colors">
              Categories
            </Link>
          )}
        </nav>

        {/* Authentication Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-interview-primary hover:bg-interview-primary/90" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-interview-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 py-4 shadow-md z-40">
          <div className="container mx-auto flex flex-col gap-4 px-6">
            <button 
              className="text-interview-text hover:text-interview-primary transition-colors py-2 text-left"
              onClick={() => handleNavigation('/')}
            >
              Home
            </button>
            <button 
              className="text-interview-text hover:text-interview-primary transition-colors py-2 text-left"
              onClick={() => handleNavigation('/features')}
            >
              Features
            </button>
            {isLoggedIn && (
              <button 
                className="text-interview-text hover:text-interview-primary transition-colors py-2 text-left"
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </button>
            )}
            {isLoggedIn && (
              <button 
                className="text-interview-text hover:text-interview-primary transition-colors py-2 text-left"
                onClick={() => handleNavigation('/categories')}
              >
                Categories
              </button>
            )}
            <div className="flex flex-col gap-3 pt-2">
              {!isLoggedIn ? (
                <>
                  <Button variant="outline" onClick={() => handleNavigation('/login')}>
                    Login
                  </Button>
                  <Button className="bg-interview-primary hover:bg-interview-primary/90" onClick={() => handleNavigation('/signup')}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut size={16} /> Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
