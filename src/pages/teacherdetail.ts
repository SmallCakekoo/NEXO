class TeacherDetailPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // In a real application, you would get teacher details from URL or state
        const teacherId = new URLSearchParams(window.location.search).get('id') || '1';
        
        this.shadowRoot!.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #f0f2fa;
                    min-height: 100vh;
                }
                
                body {
                    margin: 0;
                    background-color: #f0f2fa;
                }
                
                .page-wrapper {
                    min-height: 100vh;
                    padding-bottom: 60px;
                    background-color: #f0f2fa;
                }
                
                .teacher-detail-container {
                    max-width: 850px;
                    margin: 0 auto;
                    padding: 25px 20px;
                    font-family: 'Arial', sans-serif;
                    background-color: #f8f9fd;
                    box-shadow: 0 8px 25px rgba(83, 84, 237, 0.08);
                    border-radius: 20px;
                    margin-top: 20px;
                    margin-bottom: 40px;
                }
                
                back-button {
                    margin-bottom: 24px;
                    display: block;
                }
                
                @media (min-width: 768px) {
                    .teacher-detail-container {
                        padding: 30px;
                        margin-top: 25px;
                    }
                }
            </style>
            <div class="page-wrapper">
                <nav-bar></nav-bar>  
                <div class="teacher-detail-container">
                    <back-button text="Teacher Reviews" target="/academic"></back-button>
                    <teacher-detail-card 
                        name="Jimmy Ramirez" 
                        subject="Logic & Argumentation"
                        rating="3"
                        image="425">
                    </teacher-detail-card>
                    <teacher-review-form></teacher-review-form>
                    <teacher-review-list></teacher-review-list>
                </div>
            </div>
        `;
    }
}
export default TeacherDetailPage;
