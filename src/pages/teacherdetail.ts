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
    // const teacherId = new URLSearchParams(window.location.search).get('id') || '1';

    this.shadowRoot!.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color:rgb(255, 255, 255);
                    min-height: 100vh;
                }
                
                body {
                    margin: 0;
                    background-color:rgb(255, 255, 255) !important;
                }
                
                .page-wrapper {
                    min-height: 100vh;
                    padding-bottom: 60px;
                    background-color: #ffffff;
                }
                
                .teacher-detail-container {
                    max-width: 850px;
                    margin: 0 auto;
                    padding: 25px 20px;
                    font-family: 'Arial', sans-serif;
                    background-color: #f8f9fd;
                    border-radius: 20px;
                    margin-top: 20px;
                    margin-bottom: 40px;
                    margin-left: 16px;
                    margin-right: 16px;
                }
                
                back-button {
                    margin-bottom: 24px;
                    display: block;
                }
                
                @media (min-width: 768px) {
                    .teacher-detail-container {
                        padding: 30px;
                        margin-top: 25px;
                        margin-left: auto;
                        margin-right: auto;
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
                    <teacher-comments-container></teacher-comments-container>
                </div>
            </div>
        `;
  }
}
export default TeacherDetailPage;
