import { collection, getDocs } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { UserType } from "../../types/Register/UserType";

export async function fetchUsers(): Promise<UserType[]> {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users: UserType[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            username: data.username || "Unknown",
            email: data.email || "",
            phone: data.phone || "",
            semester: data.semester || "",
            career: data.career || "",
            password: data.password || ""
        };
    });
    return users;
}