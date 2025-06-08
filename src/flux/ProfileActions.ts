import { AppDispatcher } from "./Dispatcher";
import { store } from "./Store";

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
    const loggedInUser = store.getLoggedInUser();
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

  updateProfile: (profileData: {
    username: string;
    phone: string;
    degree: string;
    semester: string;
    bio: string;
  }) => {
    try {
      // Get current user data
      const loggedInUser = store.getLoggedInUser();
      if (!loggedInUser) {
        AppDispatcher.dispatch({
          type: ProfileActionTypes.UPDATE_PROFILE_ERROR,
          payload: { error: "No logged in user found" },
        });
        return;
      }

      const oldUsername = loggedInUser.username;

      // Update user data
      const updatedUser = {
        ...loggedInUser,
        ...profileData,
      };

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

  updateProfilePhoto(photoBase64: string) {
    AppDispatcher.dispatch({
      type: ProfileActionTypes.UPDATE_PROFILE_PHOTO,
      payload: { photo: photoBase64 },
    });
  },
};
