export type ViewType = 'day' | 'week' | 'month' | 'agenda';

interface Candidate {
  id: number;
  candidate_firstName: string;
  candidate_lastName: string;
  candidateGender: string;
  candidateComment: string;
  candidate_email: string;
}

interface Interviewer {
  id: number;
  last_login: null;
  userEmail: string;
  username: string;
  firstName: string;
  lastName: string;
  userRole: string;
}

interface JobDetails {
  id: number;
  jobRequest_Title: string;
  jobRequest_Role: string;
  jobRequest_KeySkills: string;
  jobRequest_Description: string;
}

interface UserDetails {
  id: number;
  question_score: null;
  status: null;
  candidate: Candidate;
  handled_by: Interviewer;
  job_id: JobDetails;
}

export interface CalendarEvent {
  id: number;
  summary: string;
  desc: string;
  start: string;
  end: string;
  attendees: null;
  status: null;
  comment: null;
  score: Record<string, number>;
  link: string;
  user_det: UserDetails;
  job_id: JobDetails;
}

export interface EventGroup {
  time: string;
  events: CalendarEvent[];
}

export interface TimeSlot {
  start: Date;
  end: Date;
} 