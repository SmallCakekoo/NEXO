class SubjectDetailPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // In a real application, you would get subject details from URL or state
    // const subjectId = new URLSearchParams(window.location.search).get('id') || '1';

    this.shadowRoot!.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #ffffff;
                    min-height: 100vh;
                }
                
                body {
                    margin: 0;
                    background-color: #ffffff;
                }
                
                .page-wrapper {
                    min-height: 100vh;
                    padding-bottom: 60px;
                    background-color: #ffffff;
                }
                
                .subject-detail-container {
                    max-width: 850px;
                    margin: 0 auto;
                    padding: 25px 20px;
                    font-family: 'Arial', sans-serif;
                    background-color: #f8f9fd;
                    border-radius: 20px;
                    margin-top: 20px;
                    margin-bottom: 40px;
                }
                
                back-button {
                    margin-bottom: 24px;
                    display: block;
                }
                
                @media (min-width: 768px) {
                    .subject-detail-container {
                        padding: 30px;
                        margin-top: 25px;
                    }
                }
            </style>
            <div class="page-wrapper">
                <nav-bar></nav-bar>  
                <div class="subject-detail-container">
                    <back-button text="Subject Reviews" target="/academic"></back-button>
                    <subject-detail-card 
                        name="Logic & Argumentation" 
                        career="Computer Science"
                        nucleus="Disciplinary"
                        credits="3"
                        rating="4"
                        image="301">
                    </subject-detail-card>
                    <subject-comments-container></subject-comments-container>
                </div>
            </div>
        `;
  }
}

export default SubjectDetailPage;
