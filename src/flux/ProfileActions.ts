import { AppDispatcher } from "./Dispatcher";
import { store } from "./Store";
import { db } from "../services/Firebase/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { uploadProfileImage } from "./SupabaseStorage";

// Action Types
export const ProfileActionTypes = {
  DELETE_ACCOUNT: "DELETE_ACCOUNT",
  DELETE_ACCOUNT_SUCCESS: "DELETE_ACCOUNT_SUCCESS",
  DELETE_ACCOUNT_ERROR: "DELETE_ACCOUNT_ERROR",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  UPDATE_PROFILE_SUCCESS: "UPDATE_PROFILE_SUCCESS",
  UPDATE_PROFILE_ERROR: "UPDATE_PROFILE_ERROR",
  LOGOUT: "LOGOUT",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  LOGOUT_ERROR: "LOGOUT_ERROR",
  UPDATE_PROFILE_PHOTO: "UPDATE_PROFILE_PHOTO",
};

export const ProfileActions = {
  deleteAccount: () => {
    // Get current user data
    const loggedInUser = store.getState().auth.user;
    if (!loggedInUser) {
      AppDispatcher.dispatch({
        type: ProfileActionTypes.DELETE_ACCOUNT_ERROR,
        payload: { error: "No logged in user found" },
      });
      return;
    }

    try {
      store.deleteAccount(loggedInUser.username);

      // Dispatch success action
      AppDispatcher.dispatch({
        type: ProfileActionTypes.DELETE_ACCOUNT_SUCCESS,
        payload: { username: loggedInUser.username },
      });
    } catch (error) {
      // Dispatch error action
      AppDispatcher.dispatch({
        type: ProfileActionTypes.DELETE_ACCOUNT_ERROR,
        payload: { error: "Failed to delete account" },
      });
    }
  },

  updateProfile: async (profileData: {
    username: string;
    phone: string;
    degree: string;
    semester: string;
    bio: string;
  }) => {
    try {
      // Get current user data
      const loggedInUser = store.getState().auth.user;
      if (!loggedInUser) {
        AppDispatcher.dispatch({
          type: ProfileActionTypes.UPDATE_PROFILE_ERROR,
          payload: { error: "No logged in user found" },
        });
        return;
      }

      // Validate phone number
      const phoneValidation = store.validatePhone(profileData.phone);
      if (!phoneValidation.isValid) {
        // Show alert for invalid phone number
        alert("Change number action canceled, the new number should be 10 digits long and no letters");
        AppDispatcher.dispatch({
          type: ProfileActionTypes.UPDATE_PROFILE_ERROR,
          payload: { error: phoneValidation.error },
        });
        return;
      }

      const oldUsername = loggedInUser.username;

      // Update user data
      const updatedUser = {
        ...loggedInUser,
        ...profileData,
      };

      // Update Firestore (do not update profilePic)
      if (loggedInUser.uid) {
        await setDoc(
          doc(db, "users", loggedInUser.uid),
          {
            username: updatedUser.username,
            phone: updatedUser.phone,
            degree: updatedUser.degree,
            semester: updatedUser.semester,
            bio: updatedUser.bio,
          },
          { merge: true }
        );
      }

      store.updateProfile(oldUsername, updatedUser);

      // Dispatch success action
      AppDispatcher.dispatch({
        type: ProfileActionTypes.UPDATE_PROFILE_SUCCESS,
        payload: { user: updatedUser },
      });

      // Dispatch profile-updated event
      document.dispatchEvent(new CustomEvent("profile-updated"));
    } catch (error) {
      AppDispatcher.dispatch({
        type: ProfileActionTypes.UPDATE_PROFILE_ERROR,
        payload: { error: "Failed to update profile" },
      });
    }
  },

  logout: () => {
    try {
      store.removeLoggedInUser();

      AppDispatcher.dispatch({
        type: ProfileActionTypes.LOGOUT_SUCCESS,
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: ProfileActionTypes.LOGOUT_ERROR,
        payload: { error: "Failed to logout" },
      });
    }
  },

  updateProfilePhoto: async function (file: File) {
    try {
      const loggedInUser = store.getState().auth.user;
      if (!loggedInUser || !loggedInUser.uid) {
        AppDispatcher.dispatch({
          type: ProfileActionTypes.UPDATE_PROFILE_ERROR,
          payload: { error: "No logged in user found" },
        });
        return;
      }
      // Upload to Supabase
      const publicUrl = await uploadProfileImage(file, loggedInUser.uid);
      // Update Firestore user profile
      await setDoc(
        doc(db, "users", loggedInUser.uid),
        { profilePic: publicUrl },
        { merge: true }
      );
      // Update local store
      AppDispatcher.dispatch({
        type: ProfileActionTypes.UPDATE_PROFILE_PHOTO,
        payload: { photo: publicUrl },
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: ProfileActionTypes.UPDATE_PROFILE_ERROR,
        payload: { error: "Failed to update profile photo" },
      });
    }
  },
};
