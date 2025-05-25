class SubjectDetailPage extends HTMLElement {
  private subjectData: any = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Recuperar los datos de la asignatura seleccionada
    const storedData = sessionStorage.getItem("selectedSubject");
    if (storedData) {
      this.subjectData = JSON.parse(storedData);
    }

    this.render();
  }

  render() {
    // Si no hay datos, mostrar valores predeterminados
    const name = this.subjectData?.name || "Logic & Argumentation";
    const career = this.subjectData?.career || "Computer Science";
    const credits = this.subjectData?.credits || "3";
    const rating = this.subjectData?.rating || "4";
    const id = this.subjectData?.id || "301";

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
                        name="${name}" 
                        career="${career}"
                        nucleus="Disciplinary"
                        credits="${credits}"
                        rating="${rating}"
                        image="${id}">
                    </subject-detail-card>
                    <subject-comments-container subject-name="${name}">
                    </subject-comments-container>
                </div>
            </div>
        `;
  }
}

export default SubjectDetailPage;
