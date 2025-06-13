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
    if (!postId || !comment) {
      throw new Error('Post ID and comment are required');
    }

    // Validate comment structure
    if (!comment.message || !comment.name || !comment.photo) {
      throw new Error('Comment must include message, name, and photo');
    }

    console.log("Attempting to add comment to post:", postId);
    const postRef = doc(db, "posts", postId);
    
    // Add timestamp if not present
    const commentWithTimestamp = {
      ...comment,
      timestamp: comment.timestamp || new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Add unique ID
    };

    await updateDoc(postRef, {
      comments: arrayUnion(commentWithTimestamp)
    });
    console.log("Comment successfully added to post:", postId);
    return commentWithTimestamp;
  } catch (error) {
    console.error("Error in addCommentToPost for postId:", postId, error);
    throw error;
  }
}

// Get comments for a post
export async function getCommentsForPost(postId: string) {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }

    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const comments = postDoc.data().comments || [];
    // Sort comments by timestamp in descending order (newest first)
    return comments.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error in getCommentsForPost for postId:", postId, error);
    throw error;
  }
}
