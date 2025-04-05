
// Generate mock questions based on job, specialization and experience
export const generateQuestions = (job: string, specialization: string, experience: string) => {
  const levels = [
    {
      title: "Foundation Concepts",
      description: "Basic concepts and fundamentals",
      difficulty: "Easy",
      estimatedTime: 15,
      questionCount: 5,
      questions: [
        { id: 1, question: `Tell me about your experience with ${specialization}?`, type: "behavioral" },
        { id: 2, question: `What are the core principles of ${specialization}?`, type: "technical" },
        { id: 3, question: `How do you stay updated with the latest trends in ${specialization}?`, type: "behavioral" },
        { id: 4, question: `What do you know about ${job} roles in the industry?`, type: "industry" },
        { id: 5, question: `Why are you interested in working at ${job}?`, type: "behavioral" },
      ]
    },
    {
      title: "Technical Proficiency",
      description: "Core technical skills assessment",
      difficulty: "Medium",
      estimatedTime: 25,
      questionCount: 8,
      questions: [
        { id: 6, question: `Describe a challenging problem you solved related to ${specialization}.`, type: "technical" },
        { id: 7, question: `How would you implement/approach [technical scenario]?`, type: "technical" },
        { id: 8, question: `What tools and technologies are you proficient in for ${specialization}?`, type: "technical" },
        { id: 9, question: `How do you ensure code quality in your projects?`, type: "process" },
        { id: 10, question: `Explain your debugging process when facing an issue.`, type: "process" },
        { id: 11, question: `How do you approach learning new technologies?`, type: "behavioral" },
        { id: 12, question: `What project management methodologies are you familiar with?`, type: "process" },
        { id: 13, question: `How do you handle technical disagreements in a team?`, type: "behavioral" },
      ]
    },
    {
      title: "Advanced Concepts",
      description: "In-depth technical and domain knowledge",
      difficulty: "Hard",
      estimatedTime: 35,
      questionCount: 10,
      questions: [
        { id: 14, question: `Describe how you would architect a solution for [complex scenario].`, type: "technical" },
        { id: 15, question: `How would you optimize [system/process] for better performance?`, type: "technical" },
        { id: 16, question: `What are the tradeoffs between [technology A] and [technology B]?`, type: "technical" },
        { id: 17, question: `How do you ensure scalability in your solutions?`, type: "technical" },
        { id: 18, question: `Describe a time when you had to lead a technical initiative.`, type: "leadership" },
        { id: 19, question: `How do you handle technical debt in your projects?`, type: "process" },
        { id: 20, question: `What's your approach to system design?`, type: "technical" },
        { id: 21, question: `How do you balance technical excellence with business constraints?`, type: "behavioral" },
        { id: 22, question: `Describe your experience with mentoring other developers.`, type: "leadership" },
        { id: 23, question: `How do you stay ahead of evolving security threats?`, type: "technical" },
      ]
    }
  ];
  
  return levels;
};
