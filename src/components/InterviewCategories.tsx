
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Code2, 
  Database, 
  Network, 
  Cpu, 
  Calculator, 
  Users 
} from "lucide-react";

const categories = [
  {
    id: "dsa",
    title: "DSA",
    description: "Data Structures & Algorithms",
    icon: Code2,
    color: "bg-blue-500"
  },
  {
    id: "dbms",
    title: "DBMS",
    description: "Database Management Systems",
    icon: Database,
    color: "bg-green-500"
  },
  {
    id: "cn",
    title: "CN",
    description: "Computer Networks",
    icon: Network,
    color: "bg-purple-500"
  },
  {
    id: "os",
    title: "OS",
    description: "Operating Systems",
    icon: Cpu,
    color: "bg-orange-500"
  },
  {
    id: "aptitude",
    title: "Aptitude",
    description: "Logical & Quantitative Aptitude",
    icon: Calculator,
    color: "bg-red-500"
  },
  {
    id: "personality",
    title: "Personality Development",
    description: "Soft Skills & Communication",
    icon: Users,
    color: "bg-yellow-500"
  }
];

const InterviewCategories = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
    // Navigate to SubjectQuestions page with the selected category
    navigate('/subject-questions', { 
      state: { 
        category: categoryId,
        categoryTitle: categoryTitle
      } 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card 
            key={category.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-interview-primary"
            onClick={() => handleCategorySelect(category.id, category.title)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${category.color} text-white`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
};

export default InterviewCategories;
