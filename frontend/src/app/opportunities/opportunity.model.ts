export interface Opportunity {
  _id: string;
  ngo_id: any;
  title: string;
  description: string;
  required_skills: string[];
  duration: string;
  location: string;
  status: 'open' | 'closed' | 'in-progress';
  image_url?: string;
  date?: string;
  createdAt?: string;
}