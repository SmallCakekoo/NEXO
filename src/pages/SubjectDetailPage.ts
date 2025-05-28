import { store, State, Rating } from "../flux/Store";

class SubjectDetailPage extends HTMLElement {
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log("SubjectDetailPage: connectedCallback");
    this.render();
    this.unsubscribeStore = store.subscribe(this.handleStoreChange.bind(this));
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private handleStoreChange(state: State) {
    console.log("SubjectDetailPage: handleStoreChange", state);
    this.render();
  }

  private calculateAverageRating(subjectName: string): number {
    const state = store.getState();
    const ratings = state.subjectRatings[subjectName] || [];

    if (ratings.length === 0) {
      return 0;
    }

    const sum = ratings.reduce((acc: number, curr: Rating) => acc + curr.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  }

  render() {
    console.log("SubjectDetailPage: render");
    const state = store.getState();
    console.log("SubjectDetailPage: current state", state);
    const subjectData = state.selectedSubject;
    console.log("SubjectDetailPage: subjectData from store", subjectData);

    // Si no hay datos, mostrar valores predeterminados
    const name = subjectData?.name || "Logic & Argumentation";
    const career = subjectData?.career || "Computer Science";
    const credits = subjectData?.credits || "3";
    const rating = this.calculateAverageRating(name);
    const id = subjectData?.id || "301";

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
