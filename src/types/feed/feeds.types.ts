export interface Comment {
  photo: string;
  name: string;
  career: string;
  date: string;
  message: string;
}

export interface Post {
  id?: string;
  photo: string;
  name: string;
  career: string;
  semestre: string;
  message: string;
  tag: string;
  likes: number;
  date: string;
  share: string;
  comments: Comment[];
  content: string;
  category: string;
  imageUrl?: string; // Nueva propiedad para la URL de la imagen
  createdAt: string;
  userId: string;
}

export interface PostsResponse {
  posts: Post[];
}
