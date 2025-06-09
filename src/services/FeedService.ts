import { PostsResponse, Post } from "../types/feed/feeds.types";

export async function fetchPosts(): Promise<PostsResponse> {
  return { posts: [] };
}
