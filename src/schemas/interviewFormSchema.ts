
import * as z from "zod";

// Define the form schema
export const interviewFormSchema = z.object({
  job: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  specialization: z.string({ required_error: "Please select a specialization" }),
  skills: z.string().min(2, { message: "Skills must be at least 2 characters." }),
  experienceLevel: z.string({ required_error: "Please select your experience level" }),
});

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
