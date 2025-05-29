import { AppDispatcher } from "./Dispatcher";

// Action Types
export const ProfileActionTypes = {
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  DELETE_ACCOUNT_SUCCESS: 'DELETE_ACCOUNT_SUCCESS',
  DELETE_ACCOUNT_ERROR: 'DELETE_ACCOUNT_ERROR'
};

export const ProfileActions = {
  deleteAccount: () => {
    // Get current user data
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!loggedInUser) {
      AppDispatcher.dispatch({
        type: ProfileActionTypes.DELETE_ACCOUNT_ERROR,
        payload: { error: 'No logged in user found' }
      });
      return;
    }

    try {
      // Remove user from users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((u: any) => u.username !== loggedInUser.username);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Remove user's posts
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = posts.filter((p: any) => p.name !== loggedInUser.username);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));

      // Remove user's likes
      const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
      delete userLikes[loggedInUser.username];
      localStorage.setItem('userLikes', JSON.stringify(userLikes));

      // Remove user's teacher ratings
      const teacherRatings = JSON.parse(localStorage.getItem('teacherRatings') || '{}');
      Object.keys(teacherRatings).forEach(teacher => {
        teacherRatings[teacher] = teacherRatings[teacher].filter((r: any) => r.userId !== loggedInUser.username);
      });
      localStorage.setItem('teacherRatings', JSON.stringify(teacherRatings));

      // Remove user's subject ratings
      const subjectRatings = JSON.parse(localStorage.getItem('subjectRatings') || '{}');
      Object.keys(subjectRatings).forEach(subject => {
        subjectRatings[subject] = subjectRatings[subject].filter((r: any) => r.userId !== loggedInUser.username);
      });
      localStorage.setItem('subjectRatings', JSON.stringify(subjectRatings));

      // Remove logged in user
      localStorage.removeItem('loggedInUser');

      // Dispatch success action
      AppDispatcher.dispatch({
        type: ProfileActionTypes.DELETE_ACCOUNT_SUCCESS,
        payload: { username: loggedInUser.username }
      });
    } catch (error) {
      // Dispatch error action
      AppDispatcher.dispatch({
        type: ProfileActionTypes.DELETE_ACCOUNT_ERROR,
        payload: { error: 'Failed to delete account' }
      });
    }
  }
};
