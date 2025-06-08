// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { UserType } from "../../types/Register/UserType";
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
  password: string
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
    
    // Store additional user data in Firestore
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

export { db, auth, registerUser, loginUser};