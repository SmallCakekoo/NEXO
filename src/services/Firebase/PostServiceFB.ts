import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

// Add a new post
export async function addPostToFirestore(post: any) {
  const docRef = await addDoc(collection(db, "posts"), post);
  return docRef.id;
}

// Get all posts
export async function getAllPostsFromFirestore() {
  const q = query(collection(db, "posts"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

// Add a comment to a post
export async function addCommentToPost(postId: string, comment: any) {
  try {
    console.log("Attempting to add comment to post:", postId);
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
    console.log("Comment successfully added to post:", postId);
  } catch (error) {
    console.error("Error in addCommentToPost for postId:", postId, error);
  }
}

// Get comments for a post
export async function getCommentsForPost(postId: string) {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    return postDoc.data().comments || [];
  }
  return [];
}
