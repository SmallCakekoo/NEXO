import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Agregar un comentario a Firestore (colección 'comments')
export async function addCommentToFirestore(postId: string, comment: any) {
  const commentWithPostId = { ...comment, postId };
  const docRef = await addDoc(collection(db, "comments"), commentWithPostId);
  return docRef.id;
}

// Obtener comentarios de un post desde Firestore
export async function getCommentsByPostId(postId: string) {
  const q = query(collection(db, "comments"), where("postId", "==", postId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
