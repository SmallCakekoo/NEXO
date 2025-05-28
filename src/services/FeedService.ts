import { PostsResponse } from "../types/feed/feeds.types";

export async function fetchPosts(): Promise<PostsResponse> {
  try {
    // Get posts from localStorage instead of fetching from a file
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    return { posts };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { posts: [] };
  }
}
