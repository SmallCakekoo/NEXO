import { PostsResponse } from '../types/feeds.types';

export async function fetchPosts(): Promise<PostsResponse> {
    try {
        const response = await fetch("/src/data/Feed.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: PostsResponse = await response.json();
        console.log("Fetched posts:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        throw error;
    }
} 