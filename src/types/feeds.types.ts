export interface Comment {
    photo: string;
    name: string;
    career: string;
    message: string;
}

export interface Post {
    photo: string;
    name: string;
    career: string;
    semestre: string;
    message: string;
    tag: string;
    likes: number;
}

export interface PostsResponse {
    posts: Post[];
} 