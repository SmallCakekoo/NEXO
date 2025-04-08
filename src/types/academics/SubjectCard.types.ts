export interface SubjectCardAttributes {
  name: string;
  career: string;
  credits: string;
  id: string;
  rating: string;
}

export interface SubjectCardProps extends SubjectCardAttributes {
  image?: string;
}
