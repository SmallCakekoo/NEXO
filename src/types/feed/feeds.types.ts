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
  date: string;
  career: string;
  semestre: string;
  message: string;
  tag: string;
  likes: number;
  share: string;
  comments: any[];
  image?: string | null;
  createdAt?: string;
}

export interface PostsResponse {
  posts: Post[];
}
