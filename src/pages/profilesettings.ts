class ProfileSettingsPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <style>
                h2 { color: #4f46e5; }
            </style>
            
            <nav-bar></nav-bar>  
            <settings-profile-header></settings-profile-header>
            <settings-profile-container></settings-profile-container>

        `;
    }
}

export default ProfileSettingsPage;