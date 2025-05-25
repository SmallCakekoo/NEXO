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
}

export interface PostsResponse {
  posts: Post[];
}
