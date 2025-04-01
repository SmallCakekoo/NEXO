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
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .form-group label {
                    font-weight: 500;
                    color: #333;
                }

                input, select, textarea {
                    width: 100%;
                    padding: 10px;
                    border-radius: 25px;
                    border: 1px solid #ccc;
                    font-size: 16px;
                }

                .bio-container {
                    background-color: white;
                    border-radius: 15px;
                    padding: 15px;
                    margin-top: 10px;
                    position: relative;
                }

                .bio-text {
                    margin-bottom: 30px;
                }

                .char-counter {
                    position: absolute;
                    bottom: 10px;
                    right: 15px;
                    color: #666;
                    font-size: 14px;
                }

                .buttons-container {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 20px;
                }

                .save-btn {
                    background-color: #5C6EF8;
                    color: white;
                    border: none;
                    border-radius: 25px;
                    padding: 10px 40px;
                    font-size: 16px;
                    cursor: pointer;
                }

                .unlog-btn {
                    background-color: white;
                    color: black;
                    border: 1px solid #ccc;
                    border-radius: 25px;
                    padding: 10px 40px;
                    font-size: 16px;
                    cursor: pointer;
                }

                .delete-account {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    text-decoration: underline;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .settings-container {
                        max-width: 100%;
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
                        <label>Change career info</label>
                        <select id="career">
                            <option selected>Medicine</option>
                            <option>Engineering</option>
                            <option>Law</option>
                            <option>Architecture</option>
                            <option>Business</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Change semester info</label>
                        <select id="semester">
                            <option selected>Fourth semester</option>
                            <option>First semester</option>
                            <option>Second semester</option>
                            <option>Third semester</option>
                            <option>Fifth semester</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Change Phone number</label>
                        <input type="tel" id="phone" placeholder="Phone number" value="315798754">
                    </div>
                    
                    <div class="bio-container">
                        <p class="bio-text">Hi I'm Rosa (the girl of the right), I'm a medicine student that likes to have fun. Here's my insta @Rosa_Elvira.</p>
                        <span class="char-counter">Change Bio</span>
                    </div>
                    
                    <div class="buttons-container">
                        <button class="save-btn">Save</button>
                        <button class="unlog-btn">Unlog</button>
                    </div>
                    
                    <div class="delete-account">Delete account?</div>
                </div>
            </div>
        `;

        // Actualizar el contador de caracteres inicial
        this.updateCharCounter();
    }

    updateCharCounter() {
        const bioText = this.shadowRoot!.querySelector('.bio-text');
        const charCounter = this.shadowRoot!.querySelector('.char-counter');
        
        if (bioText && charCounter) {
            const text = bioText.textContent || '';
            const count = text.length;
            charCounter.textContent = `${count} caracteres`;
        }
    }

    setupEventListeners() {
        const saveBtn = this.shadowRoot!.querySelector('.save-btn');
        const unlogBtn = this.shadowRoot!.querySelector('.unlog-btn');
        const deleteAccount = this.shadowRoot!.querySelector('.delete-account');
        
        saveBtn?.addEventListener('click', () => {
            console.log('Save button clicked');
            // Aquí la lógica para guardar los cambios
        });
        
        unlogBtn?.addEventListener('click', () => {
            console.log('Unlog button clicked');
            // Aquí la lógica para cerrar sesión
        });
        
        deleteAccount?.addEventListener('click', () => {
            console.log('Delete account clicked');
            // Aquí la lógica para eliminar la cuenta
        });
    }
}

export default SettingsProfileContainer; 