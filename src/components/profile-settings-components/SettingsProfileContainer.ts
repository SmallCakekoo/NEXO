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
                        <input type="text" id="username" placeholder="Username" value="Rosa Elvira">
                    </div>
                    
                    <div class="form-group">
                        <label>Change Semester info</label>
                        <select id="Semester">
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

  // Updates the character counter based on the bio text length
  updateCharCounter() {
    const bioText = this.shadowRoot!.querySelector(".bio-text") as HTMLTextAreaElement;
    const charCounter = this.shadowRoot!.querySelector(".char-counter");

    if (bioText && charCounter) {
      const count = bioText.value.length;
      charCounter.textContent = `${count}/400 caracteres`;
    }
  }

  // This is static for now, but it will be dynamic in the future, again, jiji
  // Sets up event listeners for form interaction
  setupEventListeners() {
    const saveBtn = this.shadowRoot!.querySelector(".save-btn");
    const unlogBtn = this.shadowRoot!.querySelector(".unlog-btn");
    const deleteAccount = this.shadowRoot!.querySelector(".delete-account");
    const bioText = this.shadowRoot!.querySelector(".bio-text");

    // Updates the character counter when the bio text changes
    bioText?.addEventListener("input", () => {
      this.updateCharCounter();
    });

    // Handles the save button click
    saveBtn?.addEventListener("click", () => {
      console.log("Save button clicked");
    });

    // Handles the unlog button click
    unlogBtn?.addEventListener("click", () => {
      console.log("Unlog button clicked");
    });

    // Handles the delete account button click
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
