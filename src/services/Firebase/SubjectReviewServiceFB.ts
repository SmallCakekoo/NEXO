import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Rating } from "../../flux/Store"; // Asegúrate de importar el tipo correcto

export async function addSubjectReviewFB(review: any) {
  await addDoc(collection(db, "subjectReviews"), review);
}

export async function fetchSubjectReviewsFB(subjectName: string): Promise<Rating[]> {
  const q = query(collection(db, "subjectReviews"), where("subjectName", "==", subjectName));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      rating: data.rating || 0,
      comment: data.comment || data.text || "",
      timestamp: data.timestamp || data.date || new Date().toISOString(),
      author: data.author || "",
      image: data.image || "",
    } as Rating;
  });
}