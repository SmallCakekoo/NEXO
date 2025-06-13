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
import { addPostToFirestore, getAllPostsFromFirestore, getPostsByUsername, updatePostLikesInFirestore } from '../services/Firebase/PostServiceFB';
import { uploadPostImage } from './SupabaseStorage';

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
    currentPath: "",
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
      activeAcademicTab: "teacher",
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
    // Lista de rutas públicas
    const publicRoutes = ["/", "/login", "/signup"];

    // Si la ruta no es pública y el usuario no está autenticado, redirigir a la landing
    if (!publicRoutes.includes(newPath) && !this._myState.auth.isAuthenticated) {
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

          this._emitChange();
        }
        break;
      case PostActionTypes.LOAD_POSTS:
        if (action.payload && Array.isArray(action.payload)) {
          // Ensure only Post[] is assigned
          const posts = action.payload.filter((p: any) =>
            typeof p === 'object' && 'photo' in p && 'name' in p && 'message' in p && 'tag' in p
          );
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
          const currentPost = this._getCurrentPost();
          if (currentPost) {
            const postId = currentPost.id;
            const currentComments = this._myState.comments[postId] || [];
            this._myState = {
              ...this._myState,
              comments: {
                ...this._myState.comments,
                [postId]: [...currentComments, action.payload],
              },
            };
            this._emitChange();
          }
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
  }

  private _getUserLikes(userId: string): string[] {
    return this._myState.userLikes[userId] || [];
  }

  private _saveCurrentPost(post: any) {
    // No longer saving to sessionStorage
  }

  private _getCurrentPost(): any {
    // No longer retrieving from sessionStorage
    return null; // Or fetch from Firebase if needed
  }

  private _saveCurrentPostId(postId: string): void {
    // No longer saving to sessionStorage
  }

  private _getCurrentPostId(): string {
    // No longer retrieving from sessionStorage
    return "";
  }

  private _setFromProfile(value: boolean) {
    // No longer saving to sessionStorage
  }

  private _getFromProfile(): boolean {
    // No longer retrieving from sessionStorage
    return false;
  }

  // Add scroll position management methods
  private _saveScrollPosition(position: number): void {
    // No longer saving to sessionStorage
  }

  private _getScrollPosition(): number {
    // No longer retrieving from sessionStorage
    return 0;
  }

  private _clearReturnToFeed(): void {
    // No longer removing from sessionStorage
  }

  private _getReturnToFeed(): boolean {
    // No longer retrieving from sessionStorage
    return false;
  }

  // Public methods for scroll position
  saveScrollPosition(position: number): void {
    // No longer saving to sessionStorage
  }

  getScrollPosition(): number {
    // No longer retrieving from sessionStorage
    return 0;
  }

  clearReturnToFeed(): void {
    // No longer clearing from sessionStorage
  }

  getReturnToFeed(): boolean {
    // No longer retrieving from sessionStorage
    return false;
  }

  // Public methods for current post management
  saveCurrentPostId(postId: string): void {
    // No longer saving to sessionStorage
  }

  getCurrentPostId(): string {
    // No longer retrieving from sessionStorage
    return "";
  }

  setFromProfile(value: boolean): void {
    // No longer saving to sessionStorage
  }

  getFromProfile(): boolean {
    // No longer retrieving from sessionStorage
    return false;
  }

  setReturnToProfile(value: boolean): void {
    // No longer saving to sessionStorage
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
    try {
      // Rely on setUserFromFirebase for authentication and user data
      this.setUserFromFirebase();

      // Posts should be loaded from Firestore when needed (e.g., on feed page load)
      this.loadPostsFromFirestore(); // This will be called explicitly where posts are needed.

      // Ratings, likes, and comments will be managed directly via Firestore
      // Remove all localStorage.getItem for these as they will be fetched on demand or managed in Firestore.

      this._emitChange();
    } catch (error) {
      console.error("Error loading data:", error);
      // Reiniciar el estado en caso de error
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
      this._emitChange();
    }
  }

  private syncWithLocalStorage(): void {
    // This method is no longer needed as we removed localStorage usage
    // It will be removed entirely.
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
      // This method is no longer needed as posts are loaded directly from Firestore
      // via loadPostsFromFirestore. We will return an empty array or handle it
      // if there's a specific use case where posts are still expected from local storage,
      // but for now, it's deprecated.
      return [];
    } catch (error) {
      console.error("Failed to load posts from storage:", error);
      return [];
    }
  }

  private _savePostsToStorage(posts: Post[]): void {
    try {
      // This method is no longer needed as posts are now managed directly in Firestore.
      // We will remove any logic that attempts to save to local storage.
    } catch (error) {
      console.error("Failed to save posts to storage:", error);
    }
  }

  private _getLoggedInUser(): any {
    // Retrieve the user directly from the in-memory state
    return this._myState.auth.user;
  }

  private _removeLoggedInUser(): void {
    // No localStorage removal needed as we are not persisting user in localStorage
    // The actual logout is handled by signOut(auth) in _handleActions
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
    image?: string | null;
    video?: string | null;
    mediaType?: 'image' | 'video' | null;
    createdAt: string;
  }): Promise<void> {
    try {
      const userData = this._getUserData();
      const newPost: Post = {
        id: crypto.randomUUID(),
        photo: userData.photo,
        name: userData.name,
        career: userData.career,
        semestre: "1", // This should be updated with actual semester data
        message: postData.content,
        tag: postData.category,
        likes: 0,
        date: postData.createdAt,
        share: "0",
        comments: [],
        image: postData.image || null,
        video: postData.video || null,
        mediaType: postData.mediaType || null
      };

      await addPostToFirestore(newPost);
      this._myState.posts = [newPost, ...this._myState.posts];
      this._savePostsToStorage(this._myState.posts);
      this._emitChange();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
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
      video: p.video || null,
      mediaType: p.mediaType || null,
    }));
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
      career: p.career || '',
      semestre: p.semestre || '',
      message: p.message || '',
      tag: p.tag || '',
      likes: p.likes || 0,
      share: p.share || '0',
      comments: p.comments || [],
      image: p.image || null,
      video: p.video || null,
      mediaType: p.mediaType || null,
    }));
    this._myState = {
      ...this._myState,
      posts: profilePosts,
    };
    this._emitChange();
  }

  private _getUserData(): { photo: string; name: string; career: string } {
    const user = this._myState.auth.user;
    return {
      photo: user?.profilePic || "https://picsum.photos/seed/default/200/300",
      name: user?.username || "Anonymous",
      career: user?.career || "",
    };
  }

  // Public methods
  getUserData(): { photo: string; name: string; career: string } {
    return this._getUserData();
  }

  addComment(comment: any): void {
    const currentPost = this._getCurrentPost();
    if (!currentPost) return;

    const postId = currentPost.id;
    const currentComments = this._myState.comments[postId] || [];
    const userData = this._getUserData();

    const newComment = {
      ...userData,
      date: new Date().toLocaleDateString(),
      message: comment.message,
    };

    this._myState = {
      ...this._myState,
      comments: {
        ...this._myState.comments,
        [postId]: [...currentComments, newComment],
      },
    };

    this._emitChange();
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
    // Removed localStorage update as it's no longer used.
    // cardData and localStorage.setItem calls are removed.
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
    return this._myState.posts.find((post: Post) => post.id === postId) || null;
  }

  private _getUserLikeStatus(userId: string, postId: string): boolean {
    return this._myState.userLikes[userId] && this._myState.userLikes[userId].includes(postId);
  }

  // Public methods
  getPostById(postId: string): Post | null {
    return this._getPostById(postId);
  }

  getUserLikeStatus(userId: string, postId: string): boolean {
    return this._getUserLikeStatus(userId, postId);
  }

  private _validateUserCredentials(username: string, password: string): any | null {
    // Users are now authenticated directly with Firebase Auth.
    // This method is no longer needed as we are not validating local storage users.
    return null;
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

    // User existence check is now handled by Firebase `registerUser` before saving to Firestore.
    // The local storage check for duplicate username or email is no longer needed.

    return { isValid: true };
  }

  private _getSubjectReviews(subjectName: string): Review[] {
    // Subject reviews will be fetched directly from Firestore or managed in state.
    // This method is no longer needed for local storage retrieval.
    return [];
  }

  private _saveSubjectReview(subjectName: string, review: Review): void {
    // Subject reviews will be saved directly to Firestore or managed in state.
    // This method is no longer needed for local storage saving.
  }

  // Public methods for subject reviews
  getSubjectReviews(subjectName: string): Review[] {
    return this._getSubjectReviews(subjectName);
  }

  saveSubjectReview(subjectName: string, review: Review): void {
    this._saveSubjectReview(subjectName, review);
  }

  private _getTeacherReviews(teacherName: string): Review[] {
    // Teacher reviews will be fetched directly from Firestore or managed in state.
    // This method is no longer needed for local storage retrieval.
    return [];
  }

  private _saveTeacherReview(teacherName: string, review: Review): void {
    // Teacher reviews will be saved directly to Firestore or managed in state.
    // This method is no longer needed for local storage saving.
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
    // Account deletion now primarily involves Firebase Auth and Firestore.
    // Removing local storage items is no longer relevant.
  }

  private _updateUserProfile(oldUsername: string, updatedUser: any): void {
    // Update user profile in Firestore directly. No localStorage update needed.
    // The `updatedUser` should already be in the state if setUserFromFirebase is working.
    // This method should ideally be replaced with a direct Firestore update call.
    console.warn("'_updateUserProfile' should directly update Firestore.");
  }

  // Public methods for profile management
  deleteAccount(username: string): void {
    this._deleteUserAccount(username);
  }

  updateProfile(oldUsername: string, updatedUser: any): void {
    this._updateUserProfile(oldUsername, updatedUser);
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
    const career = user?.degree || "Unknown Career";
    const semestre = user?.semester || "";
    const photo = user?.profilePic || `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100)}`;
    return {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
      image: postData.image,
    };
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