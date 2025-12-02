export interface ContributorApplication {
  id: string;
  name: string;
  email: string;
  coverLetter: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
