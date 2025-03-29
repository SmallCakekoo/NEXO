import BtnFeed from "./components/buttons/btn-feed";
import BtnAcademic from "./components/buttons/btn-academic";
import BtnProfile from "./components/buttons/btn-profile";
import NavBar from "./components/navbar";
import FeedPage from "./pages/feed";
import AppContainer from "./components/app-container";

// import AcademicPage from "./pages/academic";
// import ProfilePage from "./pages/profile";

customElements.define("btn-feed", BtnFeed);
customElements.define("btn-academic", BtnAcademic);
customElements.define("btn-profile", BtnProfile);
customElements.define("nav-bar", NavBar);
customElements.define("feed-page", FeedPage);
customElements.define("app-container", AppContainer);

// customElements.define("academic-page", AcademicPage);
// customElements.define("profile-page", ProfilePage);
