// Componentes de navegación
import NavBarLog from "./components/navigation/NavbarLogComponent";
import NavBarLoginSignup from "./components/navigation/NavBarLoginSignupComponent";
import BackButton from "./components/BackButton";
import BtnFeed from "./components/navbar-buttons/BtnFeed";
import BtnAcademic from "./components/navbar-buttons/BtnAcademic";
import BtnProfile from "./components/navbar-buttons/BtnProfile";
import BtnLogin from "./components/navbar-buttons/BtnLogin";
import BtnSignup from "./components/navbar-buttons/BtnSignup";

// Import necessary modules for the global post listener
import { AppDispatcher } from "./flux/Dispatcher";
import { PostActionTypes } from "./types/feed/PostActionTypes";
import { PostActions } from "./flux/PostActions";

customElements.define("nav-bar", NavBarLog);
customElements.define("nav-bar-login-signup", NavBarLoginSignup);
customElements.define("back-button", BackButton);
customElements.define("btn-feed", BtnFeed);
customElements.define("btn-academic", BtnAcademic);
customElements.define("btn-profile", BtnProfile);
customElements.define("btn-login", BtnLogin);
customElements.define("btn-signup", BtnSignup);

// Páginas principales
import FeedPage from "./pages/FeedPage";
import AcademicsPage from "./pages/AcademicsPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import TeacherDetailPage from "./pages/TeacherDetailPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import LandingPage from "./pages/LandingPages";
import CommentsDetailPage from "./pages/CommentsDetailPage";
import LoginComponent from "./pages/LoginPage";
import SignUpComponent from "./pages/SignUpPage";

customElements.define("feed-page", FeedPage);
customElements.define("academics-pages", AcademicsPage);
customElements.define("profile-page", ProfilePage);
customElements.define("profile-settings-page", ProfileSettingsPage);
customElements.define("teacher-detail-page", TeacherDetailPage);
customElements.define("subject-detail-page", SubjectDetailPage);
customElements.define("landing-page", LandingPage);
customElements.define("comments-detail-page", CommentsDetailPage);
customElements.define("login-component", LoginComponent);
customElements.define("sign-up-component", SignUpComponent);

// Componentes del Feed
import PostModal from "./components/feed-components/PostModal";
import FloatingButtonAdd from "./components/FloatingButtonAdd";
import ButtonsTags from "./components/feed-components/ButtonTags";
import { PostContainer } from "./components/feed-components/PostContainer";
import TagFiltersBar from "./components/feed-components/TagFiltersBar";
import FeedPost from "./components/feed-components/FeedPost";
import ProfilePost from "./components/profile-components/ProfilePost";

customElements.define("post-modal", PostModal);
customElements.define("floating-btn", FloatingButtonAdd);
customElements.define("button-tags", ButtonsTags);
customElements.define("tag-filters-bar", TagFiltersBar);
customElements.define("feed-post", FeedPost);
customElements.define("profile-post", ProfilePost);
customElements.define("post-container", PostContainer);
// Componentes de Landing
import StartButton from "./components/landing-components/StartButton";
import LandingCards from "./components/landing-components/LandingCards";

customElements.define("start-button", StartButton);
customElements.define("landing-cards", LandingCards);

// Componentes Académicos
import SearchBar from "./components/academics-components/SearchBar";
import SubjectCard from "./components/academics-components/SubjectCard";
import SubjectsContainer from "./components/academics-components/SubjectsContainer";
import TabsComponent from "./components/academics-components/TabsComponent";
import TeacherCard from "./components/academics-components/TeacherCard";
import TeachersContainer from "./components/academics-components/TeachersContainer";

customElements.define("subject-card", SubjectCard);
customElements.define("subjects-container", SubjectsContainer);
customElements.define("tabs-component", TabsComponent);
customElements.define("teacher-card", TeacherCard);
customElements.define("teachers-container", TeachersContainer);

// Componentes de Perfil
import ProfileContainer from "./components/profile-components/ProfileContainer";
import ProfileHeader from "./components/profile-components/ProfileHeader";
import DeleteAccountConfirmation from "./components/profile-settings-components/DeleteAccountConfirmation";
import SettingsProfileContainer from "./components/profile-settings-components/SettingsProfileContainer";
import SettingsProfileHeader from "./components/profile-settings-components/SettingsProfileHeader";

customElements.define("profile-container", ProfileContainer);
customElements.define("profile-header", ProfileHeader);
customElements.define("delete-account-confirmation", DeleteAccountConfirmation);
customElements.define("settings-profile-container", SettingsProfileContainer);
customElements.define("settings-profile-header", SettingsProfileHeader);

// Componentes de Detalles de Asignatura y Profesor
import SubjectDetailCard from "./components/subject-detail-components/SubjectDetailCard";
import SubjectReviewForm from "./components/subject-detail-components/SubjectReviewForm";
import SubjectReviewList from "./components/subject-detail-components/SubjectReviewList";
import TeacherDetailCard from "./components/teacher-detail-components/TeacherDetailCard";
import TeacherReviewForm from "./components/teacher-detail-components/TeacherReviewForm";
import TeacherReviewList from "./components/teacher-detail-components/TeacherReviewList";

customElements.define("search-bar", SearchBar);
customElements.define("subject-detail-card", SubjectDetailCard);
customElements.define("subject-review-form", SubjectReviewForm);
customElements.define("subject-review-list", SubjectReviewList);
customElements.define("teacher-detail-card", TeacherDetailCard);
customElements.define("teacher-review-form", TeacherReviewForm);
customElements.define("teacher-review-list", TeacherReviewList);

// Componentes de Comentarios
import TeacherCommentsContainer from "./components/teacher-detail-components/TeacherCommentsContainer";
import SubjectCommentsContainer from "./components/subject-detail-components/SubjectCommentsContainer";
import CommentForm from "./components/comments-detail/CommentForm";
import CommentsList from "./components/comments-detail/CommentsList";
import CommentsContainer from "./components/comments-detail/CommentsContainer";
import CommentsDetailProfilePage from "./pages/CommentsDetailProfilePage";

customElements.define("teacher-comments-container", TeacherCommentsContainer);
customElements.define("subject-comments-container", SubjectCommentsContainer);
customElements.define("comment-form", CommentForm);
customElements.define("comments-list", CommentsList);
customElements.define("comments-container", CommentsContainer);
customElements.define("comments-detail-profile", CommentsDetailProfilePage);

// Componentes de Login/Signup
import "./components/login-signup-components/header-title";
import "./components/login-signup-components/form-fields";
import "./components/login-signup-components/primary-button";
import "./components/login-signup-components/divider";
import "./components/login-signup-components/social-buttons";
import "./components/login-signup-components/forgot-password";
import "./components/login-signup-components/form-field-signup";
import "./components/login-signup-components/checkbox";

// Layout principal
import AppContainer from "./layouts/AppContainer";
customElements.define("app-container", AppContainer);

// Global event listener for post publishing
// ...existing code...

document.addEventListener("post-published", (event) => {
  const customEvent = event as CustomEvent<{
    content: string;
    category: string;
    image: string | null; // Cambio de File | null a string | null (base64)
    createdAt: string;
  }>;
  const postData = customEvent.detail;

  // Usa el método centralizado
  PostActions.createPost(postData);
});
// ...existing code...

// Initial navigation or application setup
// (Keep your existing application initialization code here)
// For example, if you have a router or initial page load logic:
// document.dispatchEvent(new CustomEvent('navigate', { detail: '/landing' }));

console.log("se cargó este archivo");
