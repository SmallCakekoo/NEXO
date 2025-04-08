// El componente del new post
import PostModal from "./components/PostModal";

// El componponente del boton que permite que aparezca el new post
import FloatingButton from "./components/FloatingButton";

// El componente que contiene el boton y el new post
import FeedPage from "./pages/feed";

// El componente del new post
customElements.define("post-modal", PostModal);

// El componponente del boton que permite que aparezca el new post
customElements.define("floating-btn", FloatingButton);

// El componente que contiene el boton y el new post
customElements.define("feed-page", FeedPage);