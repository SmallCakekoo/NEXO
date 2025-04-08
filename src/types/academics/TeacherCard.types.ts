export interface TeacherCardAttributes {
  name: string;
  subject: string;
  nucleus: string;
  rating: number;
  image?: string;
  id: string;
}

export interface TeacherCardProps extends TeacherCardAttributes {
  onNavigate?: (path: string) => void;
}
