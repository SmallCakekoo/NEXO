// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { UserType } from "../../types/Register/UserType";
import { uploadProfileImage } from "../../flux/SupabaseStorage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjPD4_kmHnQRDDyhwX51Zu0iiowlt54XA",
  authDomain: "nexo-2d650.firebaseapp.com",
  projectId: "nexo-2d650",
  storageBucket: "nexo-2d650.firebasestorage.app",
  messagingSenderId: "561680150156",
  appId: "1:561680150156:web:392db0b22394775633d5a9",
  measurementId: "G-XH7LZ775HR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const registerUser = async (
  username: string,
  email: string,
  phone: string,
  career: string,
  semester: string,
  password: string,
  profileImageFile?: File
) => {
  try {
    console.log("Registering user with username:", username);
    
    // First check if username already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { isRegistered: false, error: "Username already exists" };
    }

    // Create user with email/password in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Store additional user data in Firestore, including UID, semester, and career
    const userData = {
      uid: userCredential.user.uid,
      username: username,
      email: email,
      phone: phone,
      career: career,
      semester: semester,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, "users", userCredential.user.uid), userData);

    // If a profile image is provided, upload to Supabase and update Firestore
    if (profileImageFile) {
      const imageUrl = await uploadProfileImage(profileImageFile, userCredential.user.uid);
      await updateDoc(doc(db, "users", userCredential.user.uid), { profileImage: imageUrl });
    }
    
    return { isRegistered: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isRegistered: false, error: error };
  }
};

const loginUser = async (username: string, password: string) => {
  try {
    console.log("Logging in user with username:", username);
    
    // First find the user's email by username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { isLoggedIn: false, error: "User not found" };
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Login with email/password
    const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
    console.log(userCredential.user);
    
    return { isLoggedIn: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isLoggedIn: false, error: error };
  }
}

/**
 * Save a Supabase file URL to Firestore in the 'archivos' collection.
 * @param nombre - The display name for the file
 * @param url - The public URL from Supabase
 * @param id - The Firestore document ID (e.g., 'archivo_1')
 *
 * Example usage:
 *   await saveSupabaseUrlToFirestore(
 *     'Mi imagen desde Supabase',
 *     'https://bnmfdyivzrqzfdebnljj.supabase.co/storage/v1/object/public/imagenes/mi-foto.jpg',
 *     'archivo_1'
 *   );
 */
export async function saveSupabaseUrlToFirestore(nombre: string, url: string, id: string) {
  await setDoc(doc(db, 'archivos', id), {
    nombre,
    url
  });
}

export { db, auth, registerUser, loginUser};