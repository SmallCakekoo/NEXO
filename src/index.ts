import BtnFeed from "./components/navbar-buttons/BtnFeed";
import BtnAcademic from "./components/navbar-buttons/BtnAcademic";
import BtnProfile from "./components/navbar-buttons/BtnProfile";

import NavBar from "./components/NavbarComponent";

import FeedPage from "./pages/feed";
import AcademicsPages from "./pages/academics";
import ProfilePage from "./pages/profile";
import ProfileSettingsPage from "./pages/profilesettings";

import AppContainer from "./components/AppContainer";

import TabsComponent from "./components/academics-components/TabsComponent";
import SearchBar from "./components/academics-components/SearchBar";
import TeacherCard from "./components/academics-components/TeacherCard";
import SubjectCard from "./components/academics-components/SubjectCard";
import TeachersContainer from "./components/academics-components/TeachersContainer";
import SubjectsContainer from "./components/academics-components/SubjectsContainer";

import ProfileContainer from "./components/profile-components/ProfileContainer";
import ProfileHeader from "./components/profile-components/ProfileHeader";
import PostCard from "./components/profile-components/PostCard";
import FloatingActionButton from "./components/profile-components/FloatingActionButton";

import SettingsProfileHeader from "./components/profile-settings-components/SettingsProfileHeader";
import SettingsProfileContainer from "./components/profile-settings-components/SettingsProfileContainer";

customElements.define("btn-feed", BtnFeed);
customElements.define("btn-academic", BtnAcademic);
customElements.define("btn-profile", BtnProfile);
customElements.define("nav-bar", NavBar);
customElements.define("feed-page", FeedPage);
customElements.define("app-container", AppContainer);
customElements.define("academic-page", AcademicsPages);
customElements.define("profile-page", ProfilePage);
customElements.define("profile-settings-page", ProfileSettingsPage);
customElements.define("tabs-component", TabsComponent);
customElements.define("search-bar", SearchBar);
customElements.define("teacher-card", TeacherCard);
customElements.define("subject-card", SubjectCard);
customElements.define("teachers-container", TeachersContainer);
customElements.define("subjects-container", SubjectsContainer);
customElements.define("profile-container", ProfileContainer);
customElements.define("profile-header", ProfileHeader);
customElements.define("post-card", PostCard);
customElements.define("floating-action-button", FloatingActionButton);
customElements.define("settings-profile-header", SettingsProfileHeader);
customElements.define("settings-profile-container", SettingsProfileContainer);