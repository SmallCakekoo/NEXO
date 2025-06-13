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
  image?: string | null;
  video?: string | null;
  mediaType?: 'image' | 'video' | null;
}

export interface PostsResponse {
  posts: Post[];
}
