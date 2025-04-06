export interface Comment {
    photo: string;
    name: string;
    degree: string;
    message: string;
}

export interface Post {
    photo: string;
    name: string;
    degree: string;
    semestre: string;
    message: string;
    tag: string;
    likes: number;
}

export interface PostsResponse {
    posts: Post[];
} 