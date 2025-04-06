import DeleteAccountConfirmation from "./DeleteAccountConfirmation";

class SettingsProfileContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/styles/components/profile-settings/SettingsProfileContainer.css">
            <div class="settings-container">
                <div class="profile-form">
                    <div class="form-group">
                        <label>Change Username</label>
                        <input type="text" id="username" placeholder="Username" value="Rosa Elvira">
                    </div>
                    
                    <div class="form-group">
                        <label>Change career info</label>
                        <select id="career">
                            <option selected>Select a semester</option>
                            <option>First semester</option>
                            <option>Second semester</option>
                            <option>Third semester</option>
                            <option>Fourth semester</option>
                            <option>Fifth semester</option>
                            <option>Sixth semester</option>
                            <option>Seventh semester</option>
                            <option>Eighth semester</option>
                            <option>Ninth semester</option>
                            <option>Tenth semester</option>
                            <option>+Tenth semester</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Change career info</label>
                        <select id="career">
                            <option selected>Select a career</option>
                            <option>Business Administration with an Emphasis in International Business</option>
                            <option>Anthropology</option>
                            <option>Biology</option>
                            <option>Political Science with an Emphasis in International Relations</option>
                            <option>Communication with a Digital Approach</option>
                            <option>Public Accounting and International Finance</option>
                            <option>Law</option>
                            <option>Interactive Media Design</option>
                            <option>Industrial Design</option>
                            <option>Economics</option>
                            <option>Economics and International Business</option>
                            <option>Finance</option>
                            <option>Biochemical Engineering</option>
                            <option>Systems Engineering</option>
                            <option>Industrial Engineering</option>
                            <option>Telematics Engineering</option>
                            <option>Bachelor's Degree in Social Sciences</option>
                            <option>Bachelor's Degree in Foreign Languages with an Emphasis in English</option>
                            <option>Medicine</option>
                            <option>Music</option>
                            <option>International Marketing and Advertising</option>
                            <option>Psychology</option>
                            <option>Chemistry</option>
                            <option>Pharmaceutical Chemistry</option>
                            <option>Sociology</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Change Phone number</label>
                        <input type="tel" id="phone" placeholder="Phone number" value="315798754">
                    </div>
                    
                    <div class="bio-container">
                        <textarea class="bio-text">Hi I'm Rosa (the girl of the right), I'm a medicine student that likes to have fun. Here's my insta @Rosa_Elvira.</textarea>
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

    this.updateCharCounter();
  }

  updateCharCounter() {
    const bioText = this.shadowRoot!.querySelector(".bio-text") as HTMLTextAreaElement;
    const charCounter = this.shadowRoot!.querySelector(".char-counter");

    if (bioText && charCounter) {
      const count = bioText.value.length;
      charCounter.textContent = `${count}/280 caracteres`;
    }
  }

  setupEventListeners() {
    const saveBtn = this.shadowRoot!.querySelector(".save-btn");
    const unlogBtn = this.shadowRoot!.querySelector(".unlog-btn");
    const deleteAccount = this.shadowRoot!.querySelector(".delete-account");
    const bioText = this.shadowRoot!.querySelector(".bio-text");

    bioText?.addEventListener("input", () => {
      this.updateCharCounter();
    });

    saveBtn?.addEventListener("click", () => {
      console.log("Save button clicked");
    });

    unlogBtn?.addEventListener("click", () => {
      console.log("Unlog button clicked");
    });

    deleteAccount?.addEventListener("click", () => {
      console.log("Delete account clicked");
      const confirmationDialog = document.createElement("delete-account-confirmation");
      document.body.appendChild(confirmationDialog);

      confirmationDialog.addEventListener("delete-account-confirmed", () => {
        console.log("Account deletion confirmed");
      });
    });
  }
}

export default SettingsProfileContainer;
