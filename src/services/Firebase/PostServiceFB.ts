import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

// Add a new post
export const addPostToFirestore = async (post: any) => {
  try {
    console.log('Creating new post:', post);
    const postsRef = collection(db, "posts");
    const docRef = await addDoc(postsRef, {
      ...post,
      createdAt: new Date().toISOString(),
      comments: [] // Initialize empty comments array
    });
    console.log('Post created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding post:", error);
    return null;
  }
};

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
export const addCommentToPost = async (postId: string, comment: any) => {
  try {
    console.log('Adding comment to post:', postId);
    console.log('Comment data:', comment);

    // Get the post document
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      console.error('Post document not found:', postId);
      return null;
    }

    // Get current comments
    const postData = postDoc.data();
    const currentComments = postData.comments || [];
    
    // Add new comment
    const updatedComments = [...currentComments, {
      ...comment,
      id: new Date().getTime().toString(), // Add unique ID to comment
      createdAt: new Date().toISOString()
    }];

    // Update the document
    await updateDoc(postRef, {
      comments: updatedComments
    });

    console.log('Comment added successfully. Updated comments:', updatedComments);
    return updatedComments;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

// Get comments for a post
export const getCommentsForPost = async (postId: string): Promise<any[]> => {
  try {
    console.log('Getting comments for post:', postId);
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      console.error('Post not found:', postId);
      return [];
    }

    const postData = postDoc.data();
    return postData.comments || [];
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};
