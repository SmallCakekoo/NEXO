// El componente del new post
import PostModal from "./components/feed-components/PostModal";
// El componponente del boton que permite que aparezca el new post
import FloatingButtonAdd from "./components/FloatingButtonAdd";

// El componente del new post
customElements.define("post-modal", PostModal);
// El componponente del boton que permite que aparezca el new post
customElements.define("floating-btn", FloatingButtonAdd);

import ButtonsTags from "./components/feed-components/ButtonTags";
import PostContainer from "./components/feed-components/PostContainer";

customElements.define("post-container", PostContainer);
// botones de la navbar
import BtnFeed from "./components/navbar-buttons/BtnFeed";
import BtnAcademic from "./components/navbar-buttons/BtnAcademic";
import BtnProfile from "./components/navbar-buttons/BtnProfile";

// la navbar
import NavBarLog from "./components/navigation/NavbarLogComponent";

// el boton de regreso y el boton de flotante
import BackButton from "./components/BackButton";

// las paginas
import FeedPage from "./pages/feed";
import AcademicsPage from "./pages/academics";
import ProfilePage from "./pages/profile";
import ProfileSettingsPage from "./pages/profilesettings";
import TeacherDetailPage from "./pages/teacherdetail";
import SubjectDetailPage from "./pages/subjectdetail";
import CommentsDetailPage from "./pages/comments-detail";

// el contenedor de la app
import AppContainer from "./layouts/AppContainer";

// los componentes de los academicos
import SearchBar from "./components/academics-components/SearchBar";
import SubjectCard from "./components/academics-components/SubjectCard";
import SubjectsContainer from "./components/academics-components/SubjectsContainer";
import TabsComponent from "./components/academics-components/TabsComponent";
import TeacherCard from "./components/academics-components/TeacherCard";
import TeachersContainer from "./components/academics-components/TeachersContainer";

// los componentes del perfil
import ProfileContainer from "./components/profile-components/ProfileContainer";
import ProfileHeader from "./components/profile-components/ProfileHeader";

// los componentes de los settings del perfil
import DeleteAccountConfirmation from "./components/profile-settings-components/DeleteAccountConfirmation";
import SettingsProfileContainer from "./components/profile-settings-components/SettingsProfileContainer";
import SettingsProfileHeader from "./components/profile-settings-components/SettingsProfileHeader";

// los componentes del detalle de la asignatura
import SubjectDetailCard from "./components/subject-detail-components/SubjectDetailCard";
import SubjectReviewForm from "./components/subject-detail-components/SubjectReviewForm";
import SubjectReviewList from "./components/subject-detail-components/SubjectReviewList";

// los componentes del detalle del profesor
import TeacherDetailCard from "./components/teacher-detail-components/TeacherDetailCard";
import TeacherReviewForm from "./components/teacher-detail-components/TeacherReviewForm";
import TeacherReviewList from "./components/teacher-detail-components/TeacherReviewList";

// los contenedores de los comentarios
import TeacherCommentsContainer from "./components/teacher-detail-components/TeacherCommentsContainer";
import SubjectCommentsContainer from "./components/subject-detail-components/SubjectCommentsContainer";

// botones de la navbar
customElements.define("btn-feed", BtnFeed);
customElements.define("btn-academic", BtnAcademic);
customElements.define("btn-profile", BtnProfile);

// la navbar
customElements.define("nav-bar", NavBarLog);

// el boton de regreso y el boton de flotante
customElements.define("back-button", BackButton);

// las paginas
customElements.define("feed-page", FeedPage);
customElements.define("academics-pages", AcademicsPage);
customElements.define("profile-page", ProfilePage);
customElements.define("profile-settings-page", ProfileSettingsPage);
customElements.define("teacher-detail-page", TeacherDetailPage);
customElements.define("subject-detail-page", SubjectDetailPage);
customElements.define("comments-detail-page", CommentsDetailPage);

// el contenedor de la app
customElements.define("app-container", AppContainer);

// los componentes de los academicos
customElements.define("search-bar", SearchBar);
customElements.define("subject-card", SubjectCard);
customElements.define("subjects-container", SubjectsContainer);
customElements.define("tabs-component", TabsComponent);
customElements.define("teacher-card", TeacherCard);
customElements.define("teachers-container", TeachersContainer);

// los componentes del perfil
customElements.define("profile-container", ProfileContainer);
customElements.define("profile-header", ProfileHeader);

// los componentes de los settings del perfil
customElements.define("delete-account-confirmation", DeleteAccountConfirmation);
customElements.define("settings-profile-container", SettingsProfileContainer);
customElements.define("settings-profile-header", SettingsProfileHeader);

// los componentes del detalle de la asignatura
customElements.define("subject-detail-card", SubjectDetailCard);
customElements.define("subject-review-form", SubjectReviewForm);
customElements.define("subject-review-list", SubjectReviewList);

// los componentes del detalle del profesor
customElements.define("teacher-detail-card", TeacherDetailCard);
customElements.define("teacher-review-form", TeacherReviewForm);
customElements.define("teacher-review-list", TeacherReviewList);

// los contenedores de los comentarios
customElements.define("teacher-comments-container", TeacherCommentsContainer);
customElements.define("subject-comments-container", SubjectCommentsContainer);

//botones y post (feed)
customElements.define("button-tags", ButtonsTags);

import TagFiltersBar from "./components/feed-components/TagFiltersBar";
import FeedPost from "./components/feed-components/FeedPost";

customElements.define("tag-filters-bar", TagFiltersBar);
customElements.define("feed-post", FeedPost);
