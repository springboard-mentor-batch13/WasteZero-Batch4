export interface Opportunity {
  id?: string;
  title: string;
  description: string;
  requiredSkills: string[];
  duration: string;
  location: string;
  status: string;
  imageUrl?: string;
}