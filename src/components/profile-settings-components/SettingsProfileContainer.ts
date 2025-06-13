import { ProfileActions } from "../../flux/ProfileActions";
import { NavigationActions } from "../../flux/NavigationActions";
import { store, State } from "../../flux/Store";

class SettingsProfileContainer extends HTMLElement {
  private unsubscribe?: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render = this.render.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.setupStoreListeners();
  }

  private setupStoreListeners() {
    this.unsubscribe = store.subscribe(this.handleStoreChange);
    this.handleStoreChange(store.getState());
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  private handleStoreChange(state: State) {
    this.render();
  }

  render() {
    const user = store.getState().auth.user;

    const username = user?.username || "";
    const phone = user?.phone || "";
    const degree = user?.career || user?.degree || "";
    const semester = user?.semester || "";
    const bio = user?.bio || "";

    this.shadowRoot!.innerHTML = `
    <style>
:host {
    display: block;
    width: 100%;
    min-height: 100vh;
}

.settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.profile-form {
    background-color: #EFF0FD;
    border-radius: 30px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #6B7280;
    font-size: 15px;
    margin-left: 10px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
}

input, select {
    width: 100%;
    padding: 12px 15px;
    border-radius: 25px;
    border: 1px solid #d1d5db;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

select {
    padding-right: 30px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235C6EF8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
}

select::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 10px;
}

select::-webkit-scrollbar-track {
    background: #e3e5ff;
    border-radius: 10px;
}

select::-webkit-scrollbar-thumb {
    background: #5354ed;
    border-radius: 10px;
}

select::-webkit-scrollbar-thumb:hover {
    background: #4445c9;
    border-radius: 10px;
}

select {
    scrollbar-width: thin;
    scrollbar-color: #5354ed #f1f1f1;
}

textarea {
    width: 100%;
    padding: 12px 15px;
    border-radius: 0;
    border: 1px solid #d1d5db;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #5C6EF8;
    box-shadow: 0 0 0 3px rgba(92, 110, 248, 0.2);
}

.bio-container {
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    margin-top: 10px;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
}

.bio-container:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.bio-text {
    width: 100%;
    min-height: 100px;
    border: none;
    resize: vertical;
    font-family: inherit;
    font-size: 16px;
    line-height: 1.5;
    padding: 0;
    margin-bottom: 30px;
    background: transparent;
    border-radius: 10px;
    box-shadow: none;
}

.bio-text:focus {
    outline: none;
}

.char-counter {
    position: absolute;
    bottom: 10px;
    right: 15px;
    color: #5C6EF8;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.char-counter:hover {
    color: #4550e5;
    text-decoration: none;
}

.buttons-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.save-btn, .unlog-btn {
    font-size: 16px;
    font-weight: 600;
    border: 2px solid black;
    padding: 10px 40px;
    border-radius: 50px;
    cursor: pointer;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;
}

.save-btn {
    background-color: #5354ED;
    color: white;
}

.unlog-btn {
    background-color: white;
    color: #333;
}

.save-btn:hover, .unlog-btn:hover {
    filter: brightness(1.2);
    transform: scale(1.05);
    -webkit-box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
    -moz-box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
    box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
}

.save-btn:active, .unlog-btn:active {
    transform: scale(0.95);
    -webkit-box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
    -moz-box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
    filter: brightness(0.8);
}

#username, #phone{
 width: 96%;
}

.delete-account {
    text-align: center;
    margin-top: 5px;
    color: #dd4b39;
    font-weight: 500;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.2s ease;
}

.delete-account:hover {
    color: #c23321;
    transform: scale(1.05);
}

@media (max-width: 576px) {
    .settings-container {
        max-width: 100%;
        padding: 15px;
    }
    
    .profile-form {
        padding: 20px;
    }
    
    .buttons-container {
        flex-direction: column;
        align-items: center;
    }
    
    .save-btn, .unlog-btn {
        width: 80%;
    }
}
            </style>        
    <div class="settings-container">
                <div class="profile-form">
                    <div class="form-group">
                        <label>Change Username</label>
                        <input type="text" id="username" placeholder="Username" value="${username}">
                    </div>
                    
                    <div class="form-group">
                        <label>Change Semester info</label>
                        <select id="Semester">
                            <option value="" ${semester === "" ? "selected" : ""}>Select a semester</option>
                            <option value="First semester" ${semester === "First semester" ? "selected" : ""}>First semester</option>
                            <option value="Second semester" ${semester === "Second semester" ? "selected" : ""}>Second semester</option>
                            <option value="Third semester" ${semester === "Third semester" ? "selected" : ""}>Third semester</option>
                            <option value="Fourth semester" ${semester === "Fourth semester" ? "selected" : ""}>Fourth semester</option>
                            <option value="Fifth semester" ${semester === "Fifth semester" ? "selected" : ""}>Fifth semester</option>
                            <option value="Sixth semester" ${semester === "Sixth semester" ? "selected" : ""}>Sixth semester</option>
                            <option value="Seventh semester" ${semester === "Seventh semester" ? "selected" : ""}>Seventh semester</option>
                            <option value="Eighth semester" ${semester === "Eighth semester" ? "selected" : ""}>Eighth semester</option>
                            <option value="Ninth semester" ${semester === "Ninth semester" ? "selected" : ""}>Ninth semester</option>
                            <option value="Tenth semester" ${semester === "Tenth semester" ? "selected" : ""}>Tenth semester</option>
                            <option value="+Tenth semester" ${semester === "+Tenth semester" ? "selected" : ""}>+Tenth semester</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Change career info</label>
                        <select id="career">
                            <option value="" ${degree === "" ? "selected" : ""}>Select a career</option>
                            <option value="Business Administration with an Emphasis in International Business" ${degree === "Business Administration with an Emphasis in International Business" ? "selected" : ""}>Business Administration with an Emphasis in International Business</option>
                            <option value="Anthropology" ${degree === "Anthropology" ? "selected" : ""}>Anthropology</option>
                            <option value="Biology" ${degree === "Biology" ? "selected" : ""}>Biology</option>
                            <option value="Political Science with an Emphasis in International Relations" ${degree === "Political Science with an Emphasis in International Relations" ? "selected" : ""}>Political Science with an Emphasis in International Relations</option>
                            <option value="Communication with a Digital Approach" ${degree === "Communication with a Digital Approach" ? "selected" : ""}>Communication with a Digital Approach</option>
                            <option value="Public Accounting and International Finance" ${degree === "Public Accounting and International Finance" ? "selected" : ""}>Public Accounting and International Finance</option>
                            <option value="Law" ${degree === "Law" ? "selected" : ""}>Law</option>
                            <option value="Interactive Media Design" ${degree === "Interactive Media Design" ? "selected" : ""}>Interactive Media Design</option>
                            <option value="Industrial Design" ${degree === "Industrial Design" ? "selected" : ""}>Industrial Design</option>
                            <option value="Economics" ${degree === "Economics" ? "selected" : ""}>Economics</option>
                            <option value="Economics and International Business" ${degree === "Economics and International Business" ? "selected" : ""}>Economics and International Business</option>
                            <option value="Finance" ${degree === "Finance" ? "selected" : ""}>Finance</option>
                            <option value="Biochemical Engineering" ${degree === "Biochemical Engineering" ? "selected" : ""}>Biochemical Engineering</option>
                            <option value="Systems Engineering" ${degree === "Systems Engineering" ? "selected" : ""}>Systems Engineering</option>
                            <option value="Industrial Engineering" ${degree === "Industrial Engineering" ? "selected" : ""}>Industrial Engineering</option>
                            <option value="Telematics Engineering" ${degree === "Telematics Engineering" ? "selected" : ""}>Telematics Engineering</option>
                            <option value="Bachelor's Degree in Social Sciences" ${degree === "Bachelor's Degree in Social Sciences" ? "selected" : ""}>Bachelor's Degree in Social Sciences</option>
                            <option value="Bachelor's Degree in Foreign Languages with an Emphasis in English" ${degree === "Bachelor's Degree in Foreign Languages with an Emphasis in English" ? "selected" : ""}>Bachelor's Degree in Foreign Languages with an Emphasis in English</option>
                            <option value="Medicine" ${degree === "Medicine" ? "selected" : ""}>Medicine</option>
                            <option value="Music" ${degree === "Music" ? "selected" : ""}>Music</option>
                            <option value="International Marketing and Advertising" ${degree === "International Marketing and Advertising" ? "selected" : ""}>International Marketing and Advertising</option>
                            <option value="Psychology" ${degree === "Psychology" ? "selected" : ""}>Psychology</option>
                            <option value="Chemistry" ${degree === "Chemistry" ? "selected" : ""}>Chemistry</option>
                            <option value="Pharmaceutical Chemistry" ${degree === "Pharmaceutical Chemistry" ? "selected" : ""}>Pharmaceutical Chemistry</option>
                            <option value="Sociology" ${degree === "Sociology" ? "selected" : ""}>Sociology</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Change Phone number</label>
                        <input type="tel" id="phone" placeholder="Phone number" value="${phone}">
                    </div>
                    
                    <div class="bio-container">
                        <textarea class="bio-text">${bio}</textarea>
                        <span class="char-counter">0/280 caracteres</span>
                    </div>
                    
                    <div class="buttons-container">
                        <button class="save-btn">Save</button>
                        <button class="unlog-btn">Unlog</button>
                    </div>
                    
                    <div class="delete-account">Delete account?</div>
                </div>
            </div>
        `;

    // Explicitly set the values of the select elements after rendering
    const semesterSelect = this.shadowRoot!.querySelector("#Semester") as HTMLSelectElement;
    const careerSelect = this.shadowRoot!.querySelector("#career") as HTMLSelectElement;

    if (semesterSelect && semester) {
        semesterSelect.value = semester;
    }
    if (careerSelect && degree) {
        careerSelect.value = degree;
    }

    this.updateCharCounter();
    // Re-setup event listeners after rendering, as the DOM is replaced
    this.setupEventListeners();
  }

  updateCharCounter() {
    const bioText = this.shadowRoot!.querySelector(".bio-text") as HTMLTextAreaElement;
    const charCounter = this.shadowRoot!.querySelector(".char-counter");

    if (bioText && charCounter) {
      const count = bioText.value.length;
      charCounter.textContent = `${count}/400 caracteres`;
    }
  }

  setupEventListeners() {
    const form = this.shadowRoot!.querySelector(".profile-form");
    const bioTextarea = this.shadowRoot!.querySelector(".bio-text") as HTMLTextAreaElement;
    const deleteAccountBtn = this.shadowRoot!.querySelector(".delete-account");
    const unlogBtn = this.shadowRoot!.querySelector(".unlog-btn");
    const saveBtn = this.shadowRoot!.querySelector(".save-btn");

    if (saveBtn) {
      saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const username = (this.shadowRoot!.querySelector("#username") as HTMLInputElement).value;
        const phone = (this.shadowRoot!.querySelector("#phone") as HTMLInputElement).value;
        const degree = (this.shadowRoot!.querySelector("#career") as HTMLSelectElement).value;
        const semester = (this.shadowRoot!.querySelector("#Semester") as HTMLSelectElement).value;
        const bio = (this.shadowRoot!.querySelector(".bio-text") as HTMLTextAreaElement).value;

        const userData = {
          username: username || "",
          phone: phone || "",
          degree: degree || "",
          semester: semester || "",
          bio: bio || "",
        };

        ProfileActions.updateProfile(userData);
        NavigationActions.navigate("/profile");
      });
    }

    if (bioTextarea) {
      bioTextarea.addEventListener("input", () => this.updateCharCounter());
    }

    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener("click", () => {
        // Check if a confirmation dialog already exists
        const existingDialog = document.querySelector('delete-account-confirmation');
        if (!existingDialog) {
          const confirmationDialog = document.createElement('delete-account-confirmation');
          document.body.appendChild(confirmationDialog);
        }
      });
    }

    if (unlogBtn) {
      unlogBtn.addEventListener("click", () => {
        ProfileActions.logout();
        NavigationActions.navigate("/");
      });
    }
  }
}

export default SettingsProfileContainer;
