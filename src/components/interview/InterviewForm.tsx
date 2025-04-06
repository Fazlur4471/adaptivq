
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BriefcaseIcon, BuildingIcon, BrainIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { specializations, experienceLevels } from '@/data/interviewFormData';
import { interviewFormSchema, type InterviewFormValues } from '@/schemas/interviewFormSchema';
import { generateQuestions } from '@/utils/questionGenerator';

const InterviewForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      job: "",
      company: "",
      specialization: "",
      skills: "",
      experienceLevel: "",
    },
  });

  // Form submission handler
  const onSubmit = (values: InterviewFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Generate questions for the interview roadmap
      const levels = generateQuestions(values.job, values.specialization, values.experienceLevel);
      
      // Create roadmap data
      const roadmapData = {
        job: values.job,
        company: values.company,
        specialization: specializations.find(s => s.value === values.specialization)?.label || values.specialization,
        experienceLevel: values.experienceLevel,
        skills: values.skills,
        levels: levels,
        progress: 0,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      localStorage.setItem('interviewRoadmap', JSON.stringify(roadmapData));
      
      toast({
        title: "Roadmap Created!",
        description: "Your personalized interview preparation roadmap is ready.",
      });
      
      // Navigate to roadmap page
      navigate('/roadmap', { state: { fromForm: true } });
    } catch (error) {
      console.error("Error creating roadmap:", error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "There was a problem creating your roadmap. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                    <Input placeholder="E.g., Frontend Developer" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <BuildingIcon className="w-5 h-5 text-gray-400" />
                    <Input placeholder="E.g., Tech Company Inc." {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {specializations.map((specialization) => (
                    <SelectItem key={specialization.value} value={specialization.value}>
                      {specialization.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the area that best matches the job requirements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Skills</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <BrainIcon className="w-5 h-5 text-gray-400" />
                  <Input placeholder="E.g., React, Node.js, TypeScript" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Add comma-separated skills relevant to the position
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                We'll tailor questions to your experience level
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-interview-primary hover:bg-interview-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Creating Your Roadmap...</>
            ) : (
              <>
                Create Interview Roadmap
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InterviewForm;
