import { Post } from "../types/feed/feeds.types";

export const fetchProfilePosts = async (): Promise<{ posts: Post[] }> => {
  try {
    const response = await fetch("/data/ProfilePost.json");
    if (!response.ok) {
      throw new Error("Error al cargar los posts del perfil");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile posts:", error);
    return { posts: [] };
  }
};
