import { store, State, Rating } from "../flux/Store";

class TeacherDetailPage extends HTMLElement {
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log("TeacherDetailPage: connectedCallback");
    this.render();
    this.unsubscribeStore = store.subscribe(this.handleStoreChange.bind(this));
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private handleStoreChange(state: State) {
    console.log("TeacherDetailPage: handleStoreChange", state);
    this.render();
  }

  private calculateAverageRating(teacherName: string): number {
    console.log("TeacherDetailPage: calculateAverageRating for", teacherName);
    const state = store.getState();
    const ratings = state.teacherRatings[teacherName] || [];
    console.log("TeacherDetailPage: ratings from store", ratings);

    if (ratings.length === 0) {
      console.log("TeacherDetailPage: no ratings, returning 0");
      return 0;
    }

    const sum = ratings.reduce((acc: number, curr: Rating) => acc + curr.rating, 0);
    console.log("TeacherDetailPage: sum of ratings", sum);
    const average = Number((sum / ratings.length).toFixed(1));
    console.log("TeacherDetailPage: calculated average rating", average);
    return average;
  }

  render() {
    console.log("TeacherDetailPage: render");
    const state = store.getState();
    console.log("TeacherDetailPage: current state", state);
    const teacherData = state.selectedTeacher;
    console.log("TeacherDetailPage: teacherData from store", teacherData);

    // Si no hay datos, mostrar valores predeterminados
    const name = teacherData?.name || "Jimmy Ramirez";
    console.log("TeacherDetailPage: rendering for teacher", name);
    const subject = teacherData?.subject || "Logic & Argumentation";
    const rating = this.calculateAverageRating(name);
    const nucleus = teacherData?.nucleus || "basic";
    const image = teacherData?.image || "425";

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
