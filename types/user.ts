export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'contributor' | 'user';
  photoURL?: string;
  suspended?: boolean;
}
