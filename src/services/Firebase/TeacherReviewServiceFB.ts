import { db } from "./FirebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Rating } from "../../flux/Store"; // Asegúrate de importar el tipo correcto

export async function addTeacherReviewFB(review: any) {
  await addDoc(collection(db, "teacherReviews"), review);
}

export async function fetchTeacherReviewsFB(teacherName: string): Promise<Rating[]> {
  const q = query(collection(db, "teacherReviews"), where("teacherName", "==", teacherName));
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