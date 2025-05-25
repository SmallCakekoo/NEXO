class TeacherDetailPage extends HTMLElement {
  private teacherData: any = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Recuperar los datos del profesor seleccionado
    const storedData = sessionStorage.getItem("selectedTeacher");
    if (storedData) {
      this.teacherData = JSON.parse(storedData);
    }
    this.render();
  }

  render() {
    // Si no hay datos, mostrar valores predeterminados
    const name = this.teacherData?.name || "Jimmy Ramirez";
    const subject = this.teacherData?.subject || "Logic & Argumentation";
    const nucleus = this.teacherData?.nucleus || "basic";
    const rating = this.teacherData?.rating || "4";
    const image = this.teacherData?.image || "425";

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #ffffff;
          min-height: 100vh;
        }
        
        body {
          margin: 0;
          background-color: #ffffff !important;
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
            name="${name}" 
            subject="${subject}"
            nucleus="${nucleus}"
            rating="${rating}"
            image="${image}">
          </teacher-detail-card>
          <teacher-comments-container teacher-name="${name}">
          </teacher-comments-container>
        </div>
      </div>
    `;
  }
}
export default TeacherDetailPage;
