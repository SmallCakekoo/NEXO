import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { Post } from "../../types/feed/feeds.types"; // Asegúrate de importar tu tipo Post

export async function createPost(postData: any) {
  const docRef = await addDoc(collection(db, "posts"), postData);
  return docRef.id;
}

export async function fetchPostsFB(): Promise<Post[]> {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      photo: data.photo || "",
      name: data.name || "",
      date: data.date || "",
      career: data.career || "",
      semestre: data.semestre || "",
      message: data.message || data.content || "",
      tag: data.tag || data.category || "",
      likes: data.likes || 0,
      share: data.share || "",
      comments: data.comments || [],
      image: data.image || null,
    } as Post;
  });
}