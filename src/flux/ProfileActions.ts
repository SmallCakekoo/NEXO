import { AppDispatcher } from "./Dispatcher";

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
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!loggedInUser) {
      AppDispatcher.dispatch({
        type: ProfileActionTypes.DELETE_ACCOUNT_ERROR,
        payload: { error: "No logged in user found" },
      });
      return;
    }

    try {
      // Remove user from users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.filter((u: any) => u.username !== loggedInUser.username);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Remove user's posts
      const posts = JSON.parse(localStorage.getItem("posts") || "[]");
      const updatedPosts = posts.filter((p: any) => p.name !== loggedInUser.username);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      // Remove user's likes
      const userLikes = JSON.parse(localStorage.getItem("userLikes") || "{}");
      delete userLikes[loggedInUser.username];
      localStorage.setItem("userLikes", JSON.stringify(userLikes));

      // Remove user's teacher ratings
      const teacherRatings = JSON.parse(localStorage.getItem("teacherRatings") || "{}");
      Object.keys(teacherRatings).forEach((teacher) => {
        teacherRatings[teacher] = teacherRatings[teacher].filter(
          (r: any) => r.userId !== loggedInUser.username
        );
      });
      localStorage.setItem("teacherRatings", JSON.stringify(teacherRatings));

      // Remove user's subject ratings
      const subjectRatings = JSON.parse(localStorage.getItem("subjectRatings") || "{}");
      Object.keys(subjectRatings).forEach((subject) => {
        subjectRatings[subject] = subjectRatings[subject].filter(
          (r: any) => r.userId !== loggedInUser.username
        );
      });
      localStorage.setItem("subjectRatings", JSON.stringify(subjectRatings));

      // Remove logged in user
      localStorage.removeItem("loggedInUser");

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
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
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

      // Update loggedInUser in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      // Update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(
        (u: any) => u.username === oldUsername || u.email === loggedInUser.email
      );
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Update all posts for this user
      const posts = JSON.parse(localStorage.getItem("posts") || "[]");
      const updatedPosts = posts.map((post: any) => {
        if (post.name === oldUsername) {
          return {
            ...post,
            name: updatedUser.username,
            career: updatedUser.degree,
            semestre: updatedUser.semester,
            photo: updatedUser.profilePic || post.photo,
          };
        }
        return post;
      });
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

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
      localStorage.removeItem("loggedInUser");

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
