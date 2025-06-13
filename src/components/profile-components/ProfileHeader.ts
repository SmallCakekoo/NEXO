import { store, State } from "../../flux/Store"; // Import store and State
import { NavigationActions } from "../../flux/NavigationActions"; // Import NavigationActions

class ProfileHeader extends HTMLElement {
  private unsubscribe?: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Bind render and handleStoreChange to the component instance
    this.render = this.render.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  connectedCallback() {
    this.setupStoreListeners(); // Setup store listeners on connection
    this.addEventListeners();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private setupStoreListeners() {
    this.unsubscribe = store.subscribe(this.handleStoreChange);
    // Trigger an initial render with the current state after subscribing
    this.handleStoreChange(store.getState());
  }

  private _lastUser: any | null = null;

  private handleStoreChange(state: State) {
    // Actualizar la UI cuando el store cambie based on relevant parts of the state
    // In this case, we re-render if the auth.user state changes
    if (state.auth.user !== this._lastUser) { // Check if user data actually changed
        this._lastUser = state.auth.user;
        this.render();
    }
  }

  // Adds event listener to the "edit" button to trigger navigation
  addEventListeners() {
    const editButton = this.shadowRoot!.querySelector(".edit-button");
    editButton?.addEventListener("click", () => {
      // Dispatch the Flux navigation action
      NavigationActions.navigate("/profile-settings");
    });
  }

  render() {
    // Get logged-in user info from the store state
    const user = store.getState().auth.user;

    const name = user?.username || "Unknown User";
    const career = user?.career || user?.degree || "Unknown Career";
    const bio = user?.bio || "";
    const profilePic = user?.profilePic || "https://picsum.photos/seed/picsum/200/300";

    this.shadowRoot!.innerHTML = `
          <style>
            

:host {
  display: block;
  width: 100%;
  overflow-x: hidden;
}

.banner {
  width: 100vw;
  height: 200px;
  background-color: #ffa500;
  position: relative;
  overflow: hidden;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.banner-illustrations {
  position: absolute;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 576px) {
  .banner-image {
    content: url("/assets/images/bannerimgsmall.png");
  }
}

.profile-section {
  text-align: center;
  margin-top: -50px;
  position: relative;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  object-fit: cover;
  background-color: white;
}

.edit-button {
  position: absolute;
  right: 30%;
  top: 30px;
  background: #6366f1;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-button:hover {
  transform: scale(1.1) rotate(90deg);
  background: #5354ed;
  box-shadow: 3px 3px 15px -6px rgba(0, 0, 0, 0.4);
}

.edit-button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.edit-button svg {
  width: 20px;
  height: 20px;
  fill: white;
  transition: all 0.3s ease;
}

.edit-button:hover svg {
  fill: #ffffff;
}

.profile-info {
  background-color: white;
  padding: 20px;
}

h1 {
  margin: 10px 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.career {
  color: #6b7280;
  margin: 5px 0;
}

.bio {
  color: #4b5563;
  margin: 15px 0;
  font-size: 0.9rem;
}

          </style>
            <div class="banner">
                <div class="banner-illustrations">
                    <img class="banner-image" src="/assets/images/bannerimg.png" alt="Banner image">
                </div>
            </div>
            <div class="profile-section">
                <img class="profile-picture" src="${profilePic}" alt="Profile Picture">
                <button class="edit-button">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <div class="profile-info">
                    <h1>${name}</h1>
                    <p class="career">${career}</p>
                    <p class="bio">${bio}</p>
                </div>
            </div>
        `;

    // Reattach event listeners after rendering
    this.addEventListeners();
  }
}

export default ProfileHeader;
