import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Course {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface AssessmentTopic {
  id: string;
  course_id: string;
  topic_name: string;
  description: string;
  created_at: string;
}

export interface StudentAssessment {
  id: string;
  student_name: string;
  course_id: string;
  completed_at: string;
  average_score: number;
  created_at: string;
}

export interface AssessmentRating {
  id: string;
  assessment_id: string;
  topic_id: string;
  rating: number;
  created_at: string;
}
