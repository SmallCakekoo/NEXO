import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Comment } from "../../types/feed/feeds.types"; // Asegúrate de importar tu tipo Comment

export async function addCommentFB(comment: any) {
  await addDoc(collection(db, "comments"), comment);
}

export async function fetchCommentsFB(postId: string): Promise<Comment[]> {
  const q = query(collection(db, "comments"), where("postId", "==", postId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      photo: data.photo || "",
      name: data.name || "",
      career: data.career || "",
      date: data.date || "",
      message: data.message || "",
    } as Comment;
  });
}