import { AppDispatcher, Action } from "./Dispatcher";
import { NavigateActionsType } from "./NavigationActions";
import { SignUpActionsType, SelectionActionsType } from "./Actions";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { AuthActionsType } from "./AuthActions";
import { SearchActionTypes } from "./SearchActions";
import { ProfileActionTypes } from "./ProfileActions";
import { CommentActionsType } from "./CommentActions";
import { FeedActionsType } from "./FeedActions";
import { TagActionTypes } from "../types/feed/TagActionTypes";
import { Review } from "../types/subject-detail/SubjectReviewList.types";
import { auth, db } from "../services/Firebase/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { teachers } from "../types/academics/TeachersContainer.types";
import { subjects } from "../types/academics/SubjectsContainer.types";
import { addPostToFirestore, getAllPostsFromFirestore, getPostsByUsername, updatePostLikesInFirestore, addCommentToPost, getCommentsForPost } from '../services/Firebase/PostServiceFB';

export interface Rating {
  rating: number;
  comment: string;
  timestamp: string;
  author?: string;
  image?: string;
}

export interface Ratings {
  [key: string]: Rating[];
}

interface TeacherRatingPayload {
  teacherName: string;
  rating: number;
  comment: string;
  timestamp: string;
  author?: string;
  image?: string;
}

interface SubjectRatingPayload {
  subjectName: string;
  rating: number;
  comment: string;
  timestamp: string;
  author?: string;
  image?: string;
}

interface UpdateTeacherRatingPayload {
  teacherName: string;
  rating: number;
}

interface UpdateSubjectRatingPayload {
  subjectName: string;
  rating: number;
}

interface DeleteAccountSuccessPayload {
  username: string;
}

interface DeleteAccountErrorPayload {
  error: string;
}

interface SignUpErrorPayload {
  error: string;
}

interface PostModalPayload {
  postId: string;
}

interface TagPayload {
  tag: string;
}

interface PhotoPayload {
  photo: string;
}

export interface State {
  currentPath: string;
  history: string[];
  auth: {
    isAuthenticated: boolean;
    user: any | null;
  };
  signUp: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  posts: Post[];
  profilePosts: Post[];
  teacherRatings: Ratings;
  subjectRatings: Ratings;
  selectedTeacher: any | null;
  selectedSubject: any | null;
  searchQuery: string;
  userLikes: { [userId: string]: string[] };
  comments: { [postId: string]: any[] };
  postModal: {
    isOpen: boolean;
    postId: string | null;
  };
  selectedTag: string;
  navigation: {
    returnToFeed: boolean;
    returnToProfile: boolean;
    activeAcademicTab: string;
  };

  filteredTeachers: teachers[] | null;
  filteredSubjects: subjects[] | null;
  searchDebounceTimeout: number | null;
  teachers: teachers[];
  subjects: subjects[];
}

type Listener = (state: State) => void;

class Store {
  private _myState: State = {
    currentPath: window.location.pathname,
    history: [],
    auth: {
      isAuthenticated: false,
      user: null,
    },
    signUp: {
      loading: false,
      error: null,
      success: false,
    },
    posts: [],
    profilePosts: [],
    teacherRatings: {},
    subjectRatings: {},
    selectedTeacher: null,
    selectedSubject: null,
    searchQuery: "",
    userLikes: {},
    comments: {},
    postModal: {
      isOpen: false,
      postId: null,
    },
    selectedTag: "All",
    navigation: {
      returnToFeed: false,
      returnToProfile: false,
      activeAcademicTab: "teachers",
    },

    filteredTeachers: null,
    filteredSubjects: null,
    searchDebounceTimeout: null,
    teachers: [],
    subjects: [],
  };

  // Los componentes
  private _listeners: Listener[] = [];

  private static instance: Store;

  private constructor() {
    this._listeners = [];
    AppDispatcher.register(this._handleActions.bind(this));

    // Manejar cambios en el historial del navegador
    window.addEventListener("popstate", () => {
      const newPath = window.location.pathname;
      this._handleRouteChange(newPath);
    });
  }

  private _handleRouteChange(newPath: string) {
    // Prevent unnecessary updates if the path hasn't changed
    if (this._myState.currentPath === newPath) {
      return;
    }

    // Lista de rutas públicas
    const publicRoutes = ["/", "/login", "/signup"];

    // Si es una ruta pública, permitir acceso sin verificar autenticación
    if (publicRoutes.includes(newPath)) {
      this._myState = {
        ...this._myState,
        currentPath: newPath,
        history: [...this._myState.history, newPath],
      };
      this._emitChange();
      return;
    }

    // Para rutas protegidas, verificar autenticación
    if (!this._myState.auth.isAuthenticated) {
      window.history.replaceState({}, "", "/");
      this._myState = {
        ...this._myState,
        currentPath: "/",
        history: [...this._myState.history, "/"],
      };
    } else {
      this._myState = {
        ...this._myState,
        currentPath: newPath,
        history: [...this._myState.history, newPath],
      };
    }
    this._emitChange();
  }

  getState() {
    return this._myState;
  }

  _handleActions(action: Action): void {
    switch (action.type) {
      case AuthActionsType.CHECK_AUTH:
        this.setUserFromFirebase();
        this._emitChange();
        break;

      case AuthActionsType.LOGIN_SUCCESS:
        if (action.payload) {
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: true,
              user: action.payload,
            },
          };
          // Provisional fix: Save logged-in user to localStorage
          localStorage.setItem("loggedInUser", JSON.stringify(action.payload));
          // Si el usuario está en una ruta pública, redirigir al feed
          if (["/", "/login", "/signup"].includes(this._myState.currentPath)) {
            window.history.replaceState({}, "", "/feed");
            this._handleRouteChange("/feed");
          }
        }
        this._emitChange();
        break;

      case AuthActionsType.LOGOUT:
        signOut(auth).then(() => {
          localStorage.removeItem("loggedInUser");
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: false,
              user: null,
            },
          };
          window.history.replaceState({}, "", "/");
          this._handleRouteChange("/");
          this._emitChange();
        });
        break;
      case NavigateActionsType.NAVIGATE:
        if (action.payload && typeof action.payload === "object" && "path" in action.payload) {
          const newPath = String(action.payload.path);
          // Actualizar el historial del navegador
          window.history.pushState({}, "", newPath);
          this._handleRouteChange(newPath);
        }
        break;
      case NavigateActionsType.UPDATE_ROUTE:
        if (action.payload && typeof action.payload === "object" && "path" in action.payload) {
          const newPath = String(action.payload.path);
          // Actualizar la URL sin agregar una nueva entrada al historial
          window.history.replaceState({}, "", newPath);
          this._handleRouteChange(newPath);
        }
        break;
      case SignUpActionsType.SIGN_UP:
        this._myState = {
          ...this._myState,
          signUp: {
            loading: true,
            error: null,
            success: false,
          },
        };
        this._handleSignUp(action.payload);
        break;
      case SignUpActionsType.SIGN_UP_SUCCESS:
        this._myState = {
          ...this._myState,
          signUp: {
            loading: false,
            error: null,
            success: true,
          },
        };
        this._emitChange();
        break;
      case SignUpActionsType.SIGN_UP_ERROR:
        if (action.payload) {
          const payload = action.payload as SignUpErrorPayload;
          this._myState = {
            ...this._myState,
            signUp: {
              loading: false,
              error: payload.error,
              success: false,
            },
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.LIKE_POST:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "postId" in action.payload &&
          "likes" in action.payload
        ) {
          const postId = String(action.payload.postId);
          const likes = Number(action.payload.likes);
          this._myState = {
            ...this._myState,
            posts: this._myState.posts.map((post) =>
              post.id === postId ? { ...post, likes: likes } : post
            ),
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.UNLIKE_POST:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "postId" in action.payload &&
          "likes" in action.payload
        ) {
          const postId = String(action.payload.postId);
          const likes = Number(action.payload.likes);
          this._myState = {
            ...this._myState,
            posts: this._myState.posts.map((post) =>
              post.id === postId ? { ...post, likes: likes } : post
            ),
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.ADD_TEACHER_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "teacherName" in action.payload &&
          "rating" in action.payload &&
          "comment" in action.payload &&
          "timestamp" in action.payload
        ) {
          const payload = action.payload as TeacherRatingPayload;
          const { teacherName, rating, comment, timestamp, author, image } = payload;
          const currentRatings = this._myState.teacherRatings[teacherName] || [];
          this._myState = {
            ...this._myState,
            teacherRatings: {
              ...this._myState.teacherRatings,
              [teacherName]: [...currentRatings, { rating, comment, timestamp, author, image }],
            },
          };
          // Persist ratings to localStorage
          localStorage.setItem("teacherRatings", JSON.stringify(this._myState.teacherRatings));
          this._emitChange();
        }
        break;
      case PostActionTypes.ADD_SUBJECT_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "subjectName" in action.payload
        ) {
          const payload = action.payload as SubjectRatingPayload;
          const { subjectName, rating, comment, timestamp, author, image } = payload;
          const currentRatings = this._myState.subjectRatings[subjectName] || [];
        }
        break;
      case PostActionTypes.UPDATE_TEACHER_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "teacherName" in action.payload
        ) {
          const payload = action.payload as UpdateTeacherRatingPayload;
          const { teacherName, rating } = payload;
          const ratings = this._myState.teacherRatings[teacherName] || [];
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
              : rating;

          // Update the rating in localStorage for the teacher card
          const teacherData = JSON.parse(localStorage.getItem("selectedTeacher") || "{}");
          if (teacherData.name === teacherName) {
            teacherData.rating = averageRating.toFixed(1);
            localStorage.setItem("selectedTeacher", JSON.stringify(teacherData));
          }
          this._emitChange();
        }
        break;
      case PostActionTypes.UPDATE_SUBJECT_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "subjectName" in action.payload
        ) {
          const payload = action.payload as UpdateSubjectRatingPayload;
          const { subjectName, rating } = payload;
          const ratings = this._myState.subjectRatings[subjectName] || [];
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
              : rating;

          // Update the rating in localStorage for the subject card
          const subjectData = JSON.parse(localStorage.getItem("selectedSubject") || "{}");
          if (subjectData.name === subjectName) {
            subjectData.rating = averageRating.toFixed(1);
            localStorage.setItem("selectedSubject", JSON.stringify(subjectData));
          }
          this._emitChange();
        }
        break;
      case PostActionTypes.LOAD_POSTS:
        if (action.payload && Array.isArray(action.payload)) {
          // Cargar posts desde localStorage si existen
          const storedPosts = localStorage.getItem("posts");
          const posts = storedPosts ? JSON.parse(storedPosts) : action.payload;

          this._myState = {
            ...this._myState,
            posts: posts,
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.ADD_POST:
        if (action.payload && typeof action.payload === "object") {
          const newPost = action.payload as Post;
          const updatedPosts = [newPost, ...this._myState.posts];

          // Actualizar localStorage y estado
          localStorage.setItem("posts", JSON.stringify(updatedPosts));
          this._myState = {
            ...this._myState,
            posts: updatedPosts,
          };
          this._emitChange();
        }
        break;
      case SelectionActionsType.SELECT_TEACHER:
        if (action.payload) {
          this._myState = {
            ...this._myState,
            selectedTeacher: action.payload,
          };
          this._emitChange();
        }
        break;
      case SelectionActionsType.SELECT_SUBJECT:
        if (action.payload) {
          this._myState = {
            ...this._myState,
            selectedSubject: action.payload,
          };
          this._emitChange();
        }
        break;
      case SearchActionTypes.SEARCH_SUBJECTS:
        if (action.payload && typeof action.payload === "object") {
            const payload = action.payload as subjects[];
          // Only update if the results are different
          if (JSON.stringify(this._myState.filteredSubjects) !== JSON.stringify(payload)) {
            this._myState = {
              ...this._myState, 
              filteredSubjects: payload,
            };
            this._emitChange();
          }
        }
          break;
      case SearchActionTypes.SEARCH_TEACHERS:
        if (action.payload && typeof action.payload === "object") {
            const payload = action.payload as teachers[];
          // Only update if the results are different
          if (JSON.stringify(this._myState.filteredTeachers) !== JSON.stringify(payload)) {
            this._myState = {
              ...this._myState, 
              filteredTeachers: payload,
            };
            this._emitChange();
          }
        }
          break;
      case SearchActionTypes.CLEAR_SEARCH:
        // Only update if there are actually results to clear
        if (this._myState.filteredSubjects !== null || this._myState.filteredTeachers !== null) {
        this._myState = {
          ...this._myState,
          filteredSubjects: null,
          filteredTeachers: null,
        };
        this._emitChange();
        }
        break;
      case ProfileActionTypes.DELETE_ACCOUNT_SUCCESS:
        if (action.payload) {
          const payload = action.payload as DeleteAccountSuccessPayload;
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: false,
              user: null,
            },
            posts: this._myState.posts.filter((post) => post.name !== payload.username),
            userLikes: {},
          };
        }
        this._emitChange();
        break;
      case ProfileActionTypes.DELETE_ACCOUNT_ERROR:
        if (action.payload) {
          const payload = action.payload as DeleteAccountErrorPayload;
          console.error("Error deleting account:", payload.error);
        }
        this._emitChange();
        break;
      case CommentActionsType.ADD_COMMENT:
        if (action.payload) {
          // Call the public addComment method to handle Firebase interaction and state update
          this.addComment(action.payload);
        }
        break;
      case FeedActionsType.OPEN_POST_MODAL:
        this._myState = {
          ...this._myState,
          postModal: {
            isOpen: true,
            postId: (action.payload as PostModalPayload)?.postId || null,
          },
        };
        this._emitChange();
        break;
      case FeedActionsType.CLOSE_POST_MODAL:
        this._myState = {
          ...this._myState,
          postModal: {
            isOpen: false,
            postId: null,
          },
        };
        this._emitChange();
        break;
      case FeedActionsType.SHARE_POST:
        if (action.payload && typeof action.payload === "object" && "postId" in action.payload) {
          const payload = action.payload as PostModalPayload;
          const post = this._myState.posts.find((p) => p.id === payload.postId);
          if (post) {
            console.log("Compartiendo post:", post);
          }
        }
        break;
      case FeedActionsType.LOAD_POSTS_FROM_STORAGE:
        if (action.payload && typeof action.payload === "object" && "posts" in action.payload) {
          const payload = action.payload as { posts: Post[] };
          this._myState = {
            ...this._myState,
            posts: payload.posts,
          };
          this._emitChange();
        }
        break;
      case TagActionTypes.SELECT_TAG:
        if (action.payload) {
          const tag = action.payload as string;
          console.log("Store: Changing selected tag to:", tag);
          this._myState = {
            ...this._myState,
            selectedTag: tag,
          };
          this._emitChange();
        }
        break;
      case ProfileActionTypes.UPDATE_PROFILE_PHOTO:
        if (action.payload && typeof action.payload === "object" && "photo" in action.payload) {
          const payload = action.payload as PhotoPayload;
          const user = this._myState.auth.user;
          if (user) {
            // Save profile picture in localStorage with username-specific key
            localStorage.setItem(`profilePic_${user.username}`, payload.photo);
            
            // Update user's profile picture in state
            this._myState = {
              ...this._myState,
              auth: {
                ...this._myState.auth,
                user: {
                  ...user,
                  profilePic: payload.photo,
                },
              },
            };

            // Update user's profile picture in localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(this._myState.auth.user));

            // Update all posts for this user
            const posts = this._myState.posts.map((post) => {
              if (post.name === user.username) {
                return {
                  ...post,
                  photo: payload.photo,
                };
              }
              return post;
            });

            this._myState = {
              ...this._myState,
              posts,
            };

            localStorage.setItem("posts", JSON.stringify(posts));
            this._emitChange();
          }
        }
        break;
      case ProfileActionTypes.UPDATE_PROFILE_SUCCESS:
        if (action.payload && typeof action.payload === "object" && "user" in action.payload) {
          this._myState = {
            ...this._myState,
            auth: {
              ...this._myState.auth,
              user: action.payload.user,
            },
          };
          this._emitChange();
        }
        break;
      case NavigateActionsType.SET_RETURN_TO_FEED:
        this._myState = {
          ...this._myState,
          navigation: {
            ...this._myState.navigation,
            returnToFeed: true,
          },
        };
        sessionStorage.setItem("returnToFeed", "true");
        this._emitChange();
        break;
      case NavigateActionsType.SET_RETURN_TO_PROFILE:
        this._myState = {
          ...this._myState,
          navigation: {
            ...this._myState.navigation,
            returnToProfile: true,
          },
        };
        sessionStorage.setItem("returnToProfile", "true");
        this._emitChange();
        break;
      case NavigateActionsType.CLEAR_RETURN_FLAGS:
        this._myState = {
          ...this._myState,
          navigation: {
            ...this._myState.navigation,
            returnToFeed: false,
            returnToProfile: false,
          },
        };
        sessionStorage.removeItem("returnToFeed");
        sessionStorage.removeItem("returnToProfile");
        this._emitChange();
        break;
      case NavigateActionsType.SET_ACTIVE_ACADEMIC_TAB:
        if (action.payload && typeof action.payload === "object" && "tab" in action.payload) {
          this._myState = {
            ...this._myState,
            navigation: {
              ...this._myState.navigation,
              activeAcademicTab: String(action.payload.tab),
            },
          };
          this._emitChange();
        }
        break;
    }
  }

  private _handleSignUp(userData: any): void {
    try {
      AppDispatcher.dispatch({
        type: AuthActionsType.LOGIN_SUCCESS,
        payload: userData,
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_ERROR,
        payload: { error: "An error occurred during sign up" },
      });
    }
  }

  private _emitChange(): void {
    const state = this.getState();
    for (const listener of this._listeners) {
      listener(state);
    }
  }

  // Permite a los componentes suscribirse al store
  subscribe(listener: Listener): () => void {
    this._listeners.push(listener);
    listener(this.getState()); // Emitir estado actual al suscribirse

    // Return an unsubscribe function
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener);
    };
  }

  // Add new methods for localStorage management
  private _saveUserLikes(userId: string, postId: string, liked: boolean) {
    const userLikes = this._myState.userLikes[userId] || [];
    if (liked && !userLikes.includes(postId)) {
      userLikes.push(postId);
    } else if (!liked) {
      const index = userLikes.indexOf(postId);
      if (index > -1) {
        userLikes.splice(index, 1);
      }
    }
    this._myState.userLikes[userId] = userLikes;
    localStorage.setItem("userLikes", JSON.stringify(this._myState.userLikes));
    this._emitChange();
  }

  private _getUserLikes(userId: string): string[] {
    return this._myState.userLikes[userId] || [];
  }

  private _saveCurrentPost(post: any) {
    sessionStorage.setItem("currentPostId", post.id);
    sessionStorage.setItem("currentPost", JSON.stringify(post));
  }

  private _getCurrentPost(): any {
    const postStr = sessionStorage.getItem("currentPost");
    return postStr ? JSON.parse(postStr) : null;
  }

  private _setFromProfile(value: boolean) {
    sessionStorage.setItem("fromProfile", value.toString());
  }

  private _getFromProfile(): boolean {
    return sessionStorage.getItem("fromProfile") === "true";
  }

  // Add scroll position management methods
  private _saveScrollPosition(position: number): void {
    sessionStorage.setItem("feedScrollPosition", position.toString());
  }

  private _getScrollPosition(): number {
    const position = sessionStorage.getItem("feedScrollPosition");
    return position ? parseInt(position) : 0;
  }

  private _clearReturnToFeed(): void {
    sessionStorage.removeItem("returnToFeed");
  }

  private _getReturnToFeed(): boolean {
    return sessionStorage.getItem("returnToFeed") === "true";
  }

  // Add current post management methods
  private _saveCurrentPostId(postId: string): void {
    sessionStorage.setItem("currentPostId", postId);
  }

  private _getCurrentPostId(): string {
    return sessionStorage.getItem("currentPostId") || "";
  }

  private _setReturnToProfile(value: boolean): void {
    sessionStorage.setItem("returnToProfile", value.toString());
  }

  // Public methods for scroll position
  saveScrollPosition(position: number): void {
    this._saveScrollPosition(position);
  }

  getScrollPosition(): number {
    return this._getScrollPosition();
  }

  clearReturnToFeed(): void {
    this._clearReturnToFeed();
  }

  getReturnToFeed(): boolean {
    return this._getReturnToFeed();
  }

  // Public methods for current post management
  saveCurrentPostId(postId: string): void {
    this._saveCurrentPostId(postId);
  }

  getCurrentPostId(): string {
    return this._getCurrentPostId();
  }

  setFromProfile(value: boolean): void {
    this._setFromProfile(value);
  }

  getFromProfile(): boolean {
    return this._getFromProfile();
  }

  setReturnToProfile(value: boolean): void {
    this._setReturnToProfile(value);
  }

  // Add public methods to access the private ones
  saveUserLikes(userId: string, postId: string, liked: boolean) {
    this._saveUserLikes(userId, postId, liked);
  }

  getUserLikes(userId: string): string[] {
    return this._getUserLikes(userId);
  }

  saveCurrentPost(post: any) {
    this._saveCurrentPost(post);
  }

  getCurrentPost(): any {
    return this._getCurrentPost();
  }

  // Update load method to include userLikes
  load(): void {
    console.log("Loading initial data...");
    console.log("Load function - Initial posts state:", this._myState.posts);
    try {
      // Check if we're on a public route
      const currentPath = window.location.pathname;
      const publicRoutes = ["/", "/login", "/signup"];
      const isPublicRoute = publicRoutes.includes(currentPath);

      // Check for any logged in user
      const user = localStorage.getItem("loggedInUser");
      const hasFirebaseUser = auth.currentUser;

      // If no user is logged in at all
      if (!user && !hasFirebaseUser) {
        console.log("No user found, handling public/protected routes.");
        if (!isPublicRoute) {
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: false,
              user: null,
            },
            currentPath: "/",
          };
          window.history.replaceState({}, "", "/");
          this._handleRouteChange("/");
        } else {
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: false,
              user: null,
            },
            currentPath: currentPath,
          };
        }
        this._emitChange();
        return;
      }

      // Handle authenticated user (either from localStorage or Firebase Auth)
      const processAuthenticatedUser = async (userProfile: any) => {
        const storedProfilePic = localStorage.getItem(`profilePic_${userProfile.username}`);
        if (storedProfilePic) {
          userProfile.profilePic = storedProfilePic;
        }
        // Ensure degree and career are both present and in sync
        if (userProfile.degree) {
          userProfile.career = userProfile.degree;
        } else if (userProfile.career) {
          userProfile.degree = userProfile.career;
        }
        // Update localStorage to persist the sync
        localStorage.setItem("loggedInUser", JSON.stringify(userProfile));

        this._myState = {
          ...this._myState,
          auth: {
            isAuthenticated: true,
            user: userProfile,
          },
        };

        // Redirect if on public route
        if (isPublicRoute) {
          window.history.replaceState({}, "", "/feed");
          this._handleRouteChange("/feed");
        } else {
          this._handleRouteChange(window.location.pathname);
        }

        // Load posts and profile posts from Firebase after auth state is set
        await this.loadPostsFromFirestore();
        console.log("Load function - Posts after loadPostsFromFirestore:", this._myState.posts);
        await this.loadProfilePosts();
        console.log("Load function - Profile Posts after loadProfilePosts:", this._myState.profilePosts);

        // Load other data from localStorage (since they are not Firebase-backed yet)
        const storedTeacherRatings = localStorage.getItem("teacherRatings");
        if (storedTeacherRatings) {
          this._myState.teacherRatings = JSON.parse(storedTeacherRatings);
        }

        const storedSubjectRatings = localStorage.getItem("subjectRatings");
        if (storedSubjectRatings) {
          this._myState.subjectRatings = JSON.parse(storedSubjectRatings);
        }

        const storedUserLikes = localStorage.getItem("userLikes");
        if (storedUserLikes) {
          this._myState.userLikes = JSON.parse(storedUserLikes);
        }

        // Load navigation state from sessionStorage
        this._myState.navigation.returnToFeed = sessionStorage.getItem("returnToFeed") === "true";
        this._myState.navigation.returnToProfile = sessionStorage.getItem("returnToProfile") === "true";
        
        this.syncWithLocalStorage();
        console.log("Load function - Posts after syncWithLocalStorage:", this._myState.posts);
        this._emitChange();
      };

      if (user) {
        processAuthenticatedUser(JSON.parse(user));
      } else if (hasFirebaseUser) {
        getDoc(doc(db, "users", hasFirebaseUser.uid)).then(async (userDoc) => {
          if (userDoc.exists()) {
            await processAuthenticatedUser(userDoc.data());
          } else {
            // If user doc doesn't exist in Firestore, clear auth and redirect to landing
            console.warn("Firebase user exists but no Firestore profile. Clearing auth.");
            this._myState = {
              ...this._myState,
              auth: {
                isAuthenticated: false,
                user: null,
              },
              currentPath: "/",
            };
            localStorage.removeItem("loggedInUser");
            window.history.replaceState({}, "", "/");
            this._handleRouteChange("/");
            this._emitChange();
          }
        }).catch(error => {
          console.error("Error fetching Firebase user doc:", error);
          // Handle error as if no user was found
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: false,
              user: null,
            },
            currentPath: "/",
          };
          localStorage.removeItem("loggedInUser");
          window.history.replaceState({}, "", "/");
          this._handleRouteChange("/");
          this._emitChange();
        });
      }
    } catch (error) {
      console.error("Fatal error during store load:", error);
      this._myState = {
        ...this._myState,
        auth: {
          isAuthenticated: false,
          user: null,
        },
        posts: [],
        teacherRatings: {},
        subjectRatings: {},
        userLikes: {},
        comments: {},
      };
      this.syncWithLocalStorage(); // Still attempt cleanup
      console.log("Load function - Posts after error and syncWithLocalStorage:", this._myState.posts);
      this._emitChange();
    }
  }

  private _loadAllData(): void {
    // Cargar posts
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      this._myState.posts = JSON.parse(storedPosts);
    }

    // Cargar ratings de profesores
    const storedTeacherRatings = localStorage.getItem("teacherRatings");
    if (storedTeacherRatings) {
      this._myState.teacherRatings = JSON.parse(storedTeacherRatings);
    }

    // Cargar ratings de materias
    const storedSubjectRatings = localStorage.getItem("subjectRatings");
    if (storedSubjectRatings) {
      this._myState.subjectRatings = JSON.parse(storedSubjectRatings);
    }

    // Cargar likes de usuarios
    const storedUserLikes = localStorage.getItem("userLikes");
    if (storedUserLikes) {
      this._myState.userLikes = JSON.parse(storedUserLikes);
    }

    // Cargar comentarios
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      this._myState.comments = JSON.parse(storedComments);
    }

    // Load navigation state
    this._myState.navigation.returnToFeed = sessionStorage.getItem("returnToFeed") === "true";
    this._myState.navigation.returnToProfile =
      sessionStorage.getItem("returnToProfile") === "true";
  }

  private syncWithLocalStorage(): void {
    console.log('syncWithLocalStorage: Current auth user status:', this._myState.auth.user);
    console.log('syncWithLocalStorage: Posts state at start:', this._myState.posts);
    
    // Only proceed if user is actually authenticated in the state
    if (this._myState.auth.isAuthenticated && this._myState.auth.user) {
      const currentUsername = this._myState.auth.user.username;
      
      // Synchronize posts with the current user (if user-specific filtering is needed)
      // NOTE: Posts are primarily loaded from Firebase, this is for local filtering consistency
      // Removed: Filtering posts based on localStorage users, as Firebase is the source of truth for posts.
      // const usersFromLocalStorage = JSON.parse(localStorage.getItem("users") || "[]");
      // this._myState.posts = this._myState.posts.filter((post) =>
      //   usersFromLocalStorage.some((u: any) => u.username === post.name)
      // );
      // localStorage.setItem("posts", JSON.stringify(this._myState.posts)); // This line might not be needed if posts are Firebase only

      // Synchronize likes
      if (!this._myState.userLikes[currentUsername]) {
        this._myState.userLikes[currentUsername] = [];
      }
      localStorage.setItem("userLikes", JSON.stringify(this._myState.userLikes));
    } else {
      // Case: No user is logged in or user was just logged out
      console.log("syncWithLocalStorage: No authenticated user, clearing user-specific data from localStorage.");
      localStorage.removeItem("loggedInUser");
      
      // Clear user-specific state that is persisted locally
      this._myState = {
        ...this._myState,
        userLikes: {},
        // posts: [], // Keep posts from being cleared here, as they are now Firebase-driven
      };
      localStorage.setItem("userLikes", JSON.stringify({}));
      // localStorage.setItem("posts", JSON.stringify([])); // Removed, as posts are Firebase-driven
    }

    console.log('Final State after sync:', this._myState);
  }

  // Método mejorado para obtener posts filtrados
  getFilteredPosts(tag: string = this._myState.selectedTag): Post[] {
    const posts = this._myState.posts;

    if (!posts || !Array.isArray(posts)) {
      return [];
    }

    if (tag === "All") {
      return [...posts];
    }

    // Normalizar el tag de búsqueda
    const searchTag = tag.toLowerCase().trim();

    return posts.filter((post) => {
      if (!post.tag) return false;

      // Normalizar el tag del post
      const postTag = post.tag.toLowerCase().trim();

      return postTag === searchTag;
    });
  }

  // Add new methods for navigation state management
  getReturnToProfile(): boolean {
    return this._myState.navigation.returnToProfile;
  }

  private _loadPostsFromStorage(): Post[] {
    try {
      return JSON.parse(localStorage.getItem("posts") || "[]");
    } catch (error) {
      console.error("Failed to load posts from storage:", error);
      return [];
    }
  }

  private _savePostsToStorage(posts: Post[]): void {
    try {
      localStorage.setItem("posts", JSON.stringify(posts));
    } catch (error) {
      console.error("Failed to save posts to storage:", error);
    }
  }

  private _getLoggedInUser(): any {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch (error) {
      console.error("Error getting logged in user:", error);
      return null;
    }
  }

  private _removeLoggedInUser(): void {
    try {
      localStorage.removeItem("loggedInUser");
    } catch (error) {
      console.error("Error removing logged in user:", error);
      throw error;
    }
  }

  // Public methods for profile management
  getLoggedInUser(): any {
    return this._getLoggedInUser();
  }

  removeLoggedInUser(): void {
    this._removeLoggedInUser();
  }
  
  private _updatePostLikes(postId: string, increment: boolean): void {
    const posts = this._loadPostsFromStorage();
    const post = posts.find((p: Post) => p.id === postId);

    if (post) {
      post.likes = increment ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
      this._savePostsToStorage(posts);
    }
  }

  // Public methods
  async createPost(postData: {
    content: string;
    category: string;
    image: string | null;
  }): Promise<void> {
    const newPost = this._createNewPost({
      ...postData,
      createdAt: new Date().toISOString()
    });
    if (!newPost) return;

    // Save to Firestore
    await addPostToFirestore(newPost);

    // Reload posts from Firestore
    await this.loadPostsFromFirestore();

    // If the post belongs to the current user, also update profile posts
    const currentUser = this._getLoggedInUser();
    if (currentUser && newPost.name === currentUser.username) {
      await this.loadProfilePosts();
    }
  }

  private _safeToISOString(dateStr: string | number | Date | undefined | null): string {
    try {
      if (!dateStr) return new Date().toISOString();
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  private _createNewPost(postData: {
    content: string;
    category: string;
    image: string | null;
    createdAt: string;
  }): Post | null {
    const user = this._getLoggedInUser();
    if (!user) {
      console.error("No logged in user found");
      return null;
    }
    const name = user?.username || "Unknown User";
    const career = user?.career || user?.degree || "Unknown Career";
    const semestre = user?.semester || "";
    const photo = user?.profilePic || `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100)}`;
    return {
      photo: photo,
      name: name,
      date: new Date().toLocaleDateString(),
      career: career,
      semestre: semestre,
      message: postData.content,
      tag: postData.category,
      likes: 0,
      share: "0",
      comments: [],
      image: postData.image || null,
      createdAt: postData.createdAt,
    };
  }

  async loadPostsFromFirestore(): Promise<void> {
    const rawPosts = await getAllPostsFromFirestore();
    const posts: Post[] = rawPosts.map((p: any) => ({
      id: p.id || '',
      photo: p.photo || '',
      name: p.name || '',
      date: p.date || '',
      career: p.career || '',
      semestre: p.semestre || '',
      message: p.message || '',
      tag: p.tag || '',
      likes: p.likes || 0,
      share: p.share || '0',
      comments: p.comments || [],
      image: p.image || null,
      createdAt: p.createdAt || this._safeToISOString(p.date),
    }));

    // Sort posts by createdAt date in descending order (newest first)
    posts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    this._myState = {
      ...this._myState,
      posts,
    };
    this._emitChange();
  }

  async loadProfilePosts(): Promise<void> {
    const user = this._getLoggedInUser();
    if (!user) return;
    const rawProfilePosts = await getPostsByUsername(user.username);
    const profilePosts: Post[] = rawProfilePosts.map((p: any) => ({
      id: p.id || '',
      photo: p.photo || '',
      name: p.name || '',
      date: p.date || '',
      career: user.career || user.degree || p.career || '', // Use current user's career
      semestre: user.semester || p.semestre || '', // Use current user's semester
      message: p.message || '',
      tag: p.tag || '',
      likes: p.likes || 0,
      share: p.share || '0',
      comments: p.comments || [],
      image: p.image || null,
      createdAt: p.createdAt || this._safeToISOString(p.date),
    }));

    // Sort posts by createdAt date in descending order (newest first)
    profilePosts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    this._myState = {
      ...this._myState,
      profilePosts,
    };
    this._emitChange();
  }

  // Add a new method to get profile posts
  getProfilePosts(): Post[] {
    return this._myState.profilePosts;
  }

  private _getUserData(): { photo: string; name: string; career: string } {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
      return {
        photo: user?.profilePic || "https://picsum.photos/seed/default/200/300",
        name: user?.username || "Anonymous",
        career: user?.career || user?.degree || "",
      };
    } catch (error) {
      console.error("Error getting user data:", error);
      return {
        photo: "https://picsum.photos/seed/default/200/300",
        name: "Anonymous",
        career: "",
      };
    }
  }

  // Public methods
  getUserData(): { photo: string; name: string; career: string } {
    return this._getUserData();
  }

  async addComment(comment: any): Promise<void> {
    const currentPost = this._getCurrentPost();
    if (!currentPost) return;

    const postId = currentPost.id;
    const userData = this._getUserData();

    const newComment = {
      ...userData,
      date: new Date().toLocaleDateString(),
      message: comment.message,
      timestamp: new Date().toISOString()
    };

    try {
      console.log("Adding comment to post ID:", postId);
      console.log("New comment data:", newComment);
      // Add comment to Firebase
      await addCommentToPost(postId, newComment);
      
      // Update local state
      const currentComments = this._myState.comments[postId] || [];
      this._myState = {
        ...this._myState,
        comments: {
          ...this._myState.comments,
          [postId]: [...currentComments, newComment],
        },
      };
      this._emitChange();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  async loadCommentsForPost(postId: string): Promise<void> {
    try {
      const comments = await getCommentsForPost(postId);
      this._myState = {
        ...this._myState,
        comments: {
          ...this._myState.comments,
          [postId]: comments,
        },
      };
      this._emitChange();
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }

  private _createReview(reviewData: {
    rating: number;
    text: string;
    author: string;
    image: string;
    type: "teacher" | "subject";
    name: string;
  }): any {
    return {
      rating: reviewData.rating,
      text: reviewData.text,
      date: new Date().toLocaleDateString(),
      author: reviewData.author,
      image: reviewData.image,
      [reviewData.type === "teacher" ? "teacherName" : "subjectName"]: reviewData.name,
      type: reviewData.type,
    };
  }

  private _updateRating(type: "teacher" | "subject", name: string, rating: number): void {
    const ratings =
      type === "teacher" ? this._myState.teacherRatings : this._myState.subjectRatings;
    const currentRatings = ratings[name] || [];
    const averageRating =
      currentRatings.length > 0
        ? currentRatings.reduce((acc, curr) => acc + curr.rating, 0) / currentRatings.length
        : rating;

    // Update the rating in localStorage for the card
    const cardData = JSON.parse(
      localStorage.getItem(`selected${type === "teacher" ? "Teacher" : "Subject"}`) || "{}"
    );
    if (cardData.name === name) {
      cardData.rating = averageRating.toFixed(1);
      localStorage.setItem(
        `selected${type === "teacher" ? "Teacher" : "Subject"}`,
        JSON.stringify(cardData)
      );
    }
  }

  // Public methods
  submitReview(reviewData: {
    rating: number;
    text: string;
    type: "teacher" | "subject";
    name: string;
  }): void {
    const userData = this._getUserData();
    const review = this._createReview({
      ...reviewData,
      author: userData.name,
      image: userData.photo,
    });

    // Update ratings in state
    if (reviewData.type === "teacher") {
      const currentRatings = this._myState.teacherRatings[reviewData.name] || [];
      this._myState = {
        ...this._myState,
        teacherRatings: {
          ...this._myState.teacherRatings,
          [reviewData.name]: [
            ...currentRatings,
            {
              rating: reviewData.rating,
              comment: reviewData.text,
              timestamp: new Date().toISOString(),
              author: userData.name,
              image: userData.photo,
            },
          ],
        },
      };
      localStorage.setItem("teacherRatings", JSON.stringify(this._myState.teacherRatings));
    } else {
      const currentRatings = this._myState.subjectRatings[reviewData.name] || [];
      this._myState = {
        ...this._myState,
        subjectRatings: {
          ...this._myState.subjectRatings,
          [reviewData.name]: [
            ...currentRatings,
            {
              rating: reviewData.rating,
              comment: reviewData.text,
              timestamp: new Date().toISOString(),
              author: userData.name,
              image: userData.photo,
            },
          ],
        },
      };
      localStorage.setItem("subjectRatings", JSON.stringify(this._myState.subjectRatings));
    }

    // Update average rating
    this._updateRating(reviewData.type, reviewData.name, reviewData.rating);

    // Dispatch review action
    AppDispatcher.dispatch({
      type: reviewData.type === "teacher" ? "ADD_TEACHER_RATING" : "ADD_SUBJECT_RATING",
      payload: review,
    });

    this._emitChange();
  }

  private _getPostById(postId: string): Post | null {
    try {
      const posts = JSON.parse(localStorage.getItem("posts") || "[]");
      return posts.find((post: Post) => post.id === postId) || null;
    } catch (error) {
      console.error("Error getting post by ID:", error);
      return null;
    }
  }

  private _getUserLikeStatus(userId: string, postId: string): boolean {
    try {
      const userLikes = JSON.parse(localStorage.getItem("userLikes") || "{}");
      return userLikes[userId] && userLikes[userId].includes(postId);
    } catch (error) {
      console.error("Error getting user like status:", error);
      return false;
    }
  }

  // Public methods
  getPostById(postId: string): Post | null {
    return this._getPostById(postId);
  }

  getUserLikeStatus(userId: string, postId: string): boolean {
    return this._getUserLikeStatus(userId, postId);
  }

  private _validateUserCredentials(username: string, password: string): any | null {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      return users.find((u: any) => u.username === username && u.password === password) || null;
    } catch (error) {
      console.error("Error validating user credentials:", error);
      return null;
    }
  }

  // Public methods
  validateUserCredentials(username: string, password: string): any | null {
    return this._validateUserCredentials(username, password);
  }

  private _validateEmail(email: string): boolean {
    // Standard email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private _validatePassword(password: string): { isValid: boolean; error?: string } {
    if (password.length < 6) {
      return { isValid: false, error: "Password must be at least 6 characters long" };
    }

    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: "Password must contain at least one capital letter" };
    }

    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: "Password must contain at least one number" };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return {
        isValid: false,
        error: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>) ',
      };
    }

    return { isValid: true };
  }

  private _validatePhone(phone: string): { isValid: boolean; error?: string } {
    // First check if there are any non-digit characters
    if (!/^\d+$/.test(phone)) {
      return { isValid: false, error: "Phone number can only contain numbers (0-9)" };
    }

    // Then check the length
    if (phone.length !== 10) {
      return { isValid: false, error: "Phone number must be exactly 10 digits long" };
    }

    return { isValid: true };
  }

  // Public method for phone validation
  validatePhone(phone: string): { isValid: boolean; error?: string } {
    return this._validatePhone(phone);
  }

  private _validateSignUpForm(
    username: string,
    email: string,
    phone: string,
    password: string,
    degree: string,
    semester: string
  ): { isValid: boolean; error?: string } {
    // Check if all fields are filled
    if (!username || !email || !phone || !password || !degree || !semester) {
      return { isValid: false, error: "Please fill in all fields" };
    }

    // Validate email format
    if (!this._validateEmail(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    // Validate password requirements
    const passwordValidation = this._validatePassword(password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }

    // Validate phone number
    const phoneValidation = this._validatePhone(phone);
    if (!phoneValidation.isValid) {
      return phoneValidation;
    }

    // Check for duplicate username or email
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const duplicate = users.find((u: any) => u.username === username || u.email === email);
    if (duplicate) {
      return { isValid: false, error: "Username or email already exists" };
    }

    return { isValid: true };
  }

  private _getSubjectReviews(subjectName: string): Review[] {
    try {
      const localKey = `subjectReviews_${subjectName}`;
      return JSON.parse(localStorage.getItem(localKey) || "[]");
    } catch (error) {
      console.error("Error getting subject reviews:", error);
      return [];
    }
  }

  private _saveSubjectReview(subjectName: string, review: Review): void {
    try {
      const localKey = `subjectReviews_${subjectName}`;
      const localReviews = this._getSubjectReviews(subjectName);
      if (
        !localReviews.some(
          (r) => r.author === review.author && r.text === review.text && r.date === review.date
        )
      ) {
        localReviews.unshift(review);
        localStorage.setItem(localKey, JSON.stringify(localReviews));
      }
    } catch (error) {
      console.error("Error saving subject review:", error);
    }
  }

  // Public methods for subject reviews
  getSubjectReviews(subjectName: string): Review[] {
    return this._getSubjectReviews(subjectName);
  }

  saveSubjectReview(subjectName: string, review: Review): void {
    this._saveSubjectReview(subjectName, review);
  }

  private _getTeacherReviews(teacherName: string): Review[] {
    try {
      const localKey = `teacherReviews_${teacherName}`;
      return JSON.parse(localStorage.getItem(localKey) || "[]");
    } catch (error) {
      console.error("Error getting teacher reviews:", error);
      return [];
    }
  }

  private _saveTeacherReview(teacherName: string, review: Review): void {
    try {
      const localKey = `teacherReviews_${teacherName}`;
      const localReviews = this._getTeacherReviews(teacherName);
      if (
        !localReviews.some(
          (r) => r.author === review.author && r.text === review.text && r.date === review.date
        )
      ) {
        localReviews.unshift(review);
        localStorage.setItem(localKey, JSON.stringify(localReviews));
      }
    } catch (error) {
      console.error("Error saving teacher review:", error);
    }
  }

  // Public methods for teacher reviews
  getTeacherReviews(teacherName: string): Review[] {
    return this._getTeacherReviews(teacherName);
  }

  saveTeacherReview(teacherName: string, review: Review): void {
    this._saveTeacherReview(teacherName, review);
  }

  // Add new methods for academic tab management
  private _setActiveAcademicTab(tab: string): void {
    this._myState = {
      ...this._myState,
      navigation: {
        ...this._myState.navigation,
        activeAcademicTab: tab,
      },
    };
    this._emitChange();
  }

  getActiveAcademicTab(): string {
    return this._myState.navigation.activeAcademicTab;
  }

  // Profile-related methods
  private _deleteUserAccount(username: string): void {
    try {
      // Remove user's posts
      const posts = JSON.parse(localStorage.getItem("posts") || "[]");
      const updatedPosts = posts.filter((p: any) => p.name !== username);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      // Remove user's likes
      const userLikes = JSON.parse(localStorage.getItem("userLikes") || "{}");
      delete userLikes[username];
      localStorage.setItem("userLikes", JSON.stringify(userLikes));

      // Remove user's teacher ratings
      const teacherRatings = JSON.parse(localStorage.getItem("teacherRatings") || "{}");
      Object.keys(teacherRatings).forEach((teacher) => {
        teacherRatings[teacher] = teacherRatings[teacher].filter((r: any) => r.userId !== username);
      });
      localStorage.setItem("teacherRatings", JSON.stringify(teacherRatings));

      // Remove user's subject ratings
      const subjectRatings = JSON.parse(localStorage.getItem("subjectRatings") || "{}");
      Object.keys(subjectRatings).forEach((subject) => {
        subjectRatings[subject] = subjectRatings[subject].filter((r: any) => r.userId !== username);
      });
      localStorage.setItem("subjectRatings", JSON.stringify(subjectRatings));

      // Remove logged in user
      localStorage.removeItem("loggedInUser");
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }

  private async _updateUserProfile(oldUsername: string, updatedUser: any): Promise<void> {
    try {
      // Sync degree and career for compatibility
      if (updatedUser.degree) {
        updatedUser.career = updatedUser.degree;
      } else if (updatedUser.career) {
        updatedUser.degree = updatedUser.career;
      }

      // Get current user from auth
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      // Update user document in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        username: updatedUser.username,
        degree: updatedUser.degree,
        career: updatedUser.career,
        semester: updatedUser.semester,
        phone: updatedUser.phone,
        bio: updatedUser.bio
      });

      // Get the latest user data from Firestore
      const updatedUserDoc = await getDoc(userRef);
      if (!updatedUserDoc.exists()) {
        throw new Error("User document not found after update");
      }
      const latestUserData = updatedUserDoc.data();

      // Update loggedInUser in localStorage with the latest data
      localStorage.setItem("loggedInUser", JSON.stringify(latestUserData));

      // Update all posts for this user in Firestore
      const posts = await getAllPostsFromFirestore();
      const userPosts = posts.filter((post: any) => post.name === oldUsername);
      
      // Update each post in Firestore
      for (const post of userPosts) {
        if (post.id) {  // Only update if we have a valid Firestore document ID
          try {
            const postRef = doc(db, "posts", post.id);
            await updateDoc(postRef, {
              name: latestUserData.username,
              career: latestUserData.career || latestUserData.degree,
              semestre: latestUserData.semester,
              photo: latestUserData.profilePic || (post as any).photo,
            });
          } catch (error) {
            console.error(`Error updating post ${post.id}:`, error);
            // Continue with other posts even if one fails
            continue;
          }
        }
      }

      // Update local state with the latest data
      this._myState = {
        ...this._myState,
        auth: {
          ...this._myState.auth,
          user: latestUserData,
        },
      };
      this._emitChange();

      // Reload posts to reflect changes
      await this.loadPostsFromFirestore();
      await this.loadProfilePosts();
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Public methods for profile management
  deleteAccount(username: string): void {
    this._deleteUserAccount(username);
  }

  async updateProfile(oldUsername: string, updatedUser: any): Promise<void> {
    await this._updateUserProfile(oldUsername, updatedUser);
  }

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public validateSignUpForm(
    username: string,
    email: string,
    phone: string,
    password: string,
    degree: string,
    semester: string
  ): { isValid: boolean; error?: string } {
    return this._validateSignUpForm(username, email, phone, password, degree, semester);
  }

  async setUserFromFirebase() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        this._myState = {
          ...this._myState,
          auth: {
            isAuthenticated: true,
            user: userDoc.data(),
          },
        };
        this._emitChange();
      }
    }
  }

  async updatePostLikes(postId: string, userId: string, liked: boolean) {
    // Find the post in local state
    const postIndex = this._myState.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) return;
    const post = this._myState.posts[postIndex];
    // Update likes count
    let newLikes = post.likes || 0;
    if (liked) {
      newLikes += 1;
      // Add postId to userLikes
      if (!this._myState.userLikes[userId]) this._myState.userLikes[userId] = [];
      if (!this._myState.userLikes[userId].includes(postId)) {
        this._myState.userLikes[userId].push(postId);
      }
    } else {
      newLikes = Math.max(0, newLikes - 1);
      // Remove postId from userLikes
      if (this._myState.userLikes[userId]) {
        this._myState.userLikes[userId] = this._myState.userLikes[userId].filter(id => id !== postId);
      }
    }
    // Update Firestore
    await updatePostLikesInFirestore(postId, newLikes);
    // Update local state
    this._myState.posts[postIndex].likes = newLikes;
    this._emitChange();
  }
}

const store = Store.getInstance();
export default store;
export { store };