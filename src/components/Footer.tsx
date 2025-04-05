
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-interview-primary font-bold text-xl">InterviewPro</span>
              <span className="bg-interview-primary text-white text-xs px-2 py-1 rounded-full">AI</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Ace your next interview with AI-powered preparation and feedback.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-interview-primary">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-interview-primary">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-interview-primary">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-interview-primary">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-interview-primary">Features</Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-gray-600 hover:text-interview-primary">Roadmap</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-interview-primary">Dashboard</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-interview-primary">About Us</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-interview-primary">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-interview-primary">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-interview-primary">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-interview-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-interview-primary">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-interview-primary">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} InterviewPro AI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="bg-white border border-gray-300 rounded-md py-2 px-4 text-sm text-gray-600">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
