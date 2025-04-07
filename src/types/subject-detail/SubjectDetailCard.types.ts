export interface SubjectDetailCardAttributes {
  name: string;
  career: string;
  credits: string;
  rating: string;
  image?: string;
}

export interface SubjectDetailCardProps extends SubjectDetailCardAttributes {
  onNavigate?: (path: string) => void;
}
