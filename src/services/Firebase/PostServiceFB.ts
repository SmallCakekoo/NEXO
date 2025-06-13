import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

// Add a new post
export async function addPostToFirestore(post: any) {
  const docRef = await addDoc(collection(db, "posts"), post);
  return docRef.id;
}

// Get all posts
export async function getAllPostsFromFirestore() {
  const q = query(collection(db, "posts"));
  const querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return posts;
}

// Get posts by username
export async function getPostsByUsername(username: string) {
  const q = query(collection(db, "posts"), where("name", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update likes for a post
export async function updatePostLikesInFirestore(postId: string, newLikes: number) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { likes: newLikes });
}
