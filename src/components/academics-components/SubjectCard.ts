import { SubjectCardAttributes } from "../../types/academics/SubjectCard.types";
import { store, State, Rating } from "../../flux/Store";
import { NavigationActions } from "../../flux/NavigationActions";
import { SelectionActions } from "../../flux/Actions";

class SubjectCard extends HTMLElement {
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): (keyof SubjectCardAttributes)[] {
    return ["name", "career", "credits", "id", "rating"];
  }

  connectedCallback() {
    this.render();
    this.unsubscribeStore = store.subscribe(this.handleStoreChange.bind(this));
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private handleStoreChange() {
    this.render();
  }

  private handleClick = (event: Event) => {
    const name = this.getAttribute("name") || "";
    const career = this.getAttribute("career") || "";
    const credits = this.getAttribute("credits") || "";
    const rating = this.calculateAverageRating();
    const id = this.getAttribute("id") || "";

    const subjectData = {
      name,
      career,
      credits,
      rating,
      id,
    };

    SelectionActions.selectSubject(subjectData);

    NavigationActions.navigate("/subject-detail");
  };

  private calculateAverageRating(): number {
    const subjectName = this.getAttribute("name") || "";
    const state = store.getState();
    const ratings = state.subjectRatings[subjectName] || [];

    if (ratings.length === 0) {
      return 0;
    }

    const sum = ratings.reduce((acc: number, curr: Rating) => acc + curr.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  }

  render() {
    const name = this.getAttribute("name") || "Name not specified";
    const career = this.getAttribute("career") || "Career not specified";
    const credits = this.getAttribute("credits") || "0";
    const rating = this.calculateAverageRating();

    // Usar el nombre de la asignatura para generar un ID consistente pero único
    const hash = this.hashString(name);
    const imageId = Math.abs(hash % 30); // Asegurarnos de que esté entre 0 y 29
    const image = `https://picsum.photos/id/${imageId}/250/150`;

    const stars = Array(5)
      .fill(0)
      .map(
        (_, index) => `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${
            index < rating ? "#5354ED" : "#ccc"
          }" class="star-icon">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        `
      )
      .join("");

    this.shadowRoot!.innerHTML = `
      <style>
        .card {
          max-width: 300px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          background-color: #eff0fd;
          padding: 0;
          text-align: left;
          border: 1px solid rgb(0, 0, 0);
          transition: all 0.3s ease;
          overflow: hidden;
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
        }

        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .card:hover .image-container img {
          transform: scale(1.05);
        }

        .content {
          padding: 20px;
        }

        .card h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #2c3e50;
          line-height: 1.3;
        }

        .card p {
          font-size: 0.95rem;
          color: #666;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        .credits {
          font-size: 1rem;
          font-weight: 600;
          color: var(--nexopurple);
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .credits::before {
          content: "•";
          color: var(--nexopurple);
          font-size: 1.2rem;
        }

        .stars {
          display: flex;
          gap: 4px;
          margin-top: 12px;
        }

        .star-icon {
          transition: fill 0.2s;
          cursor: pointer;
        }
      </style>
      <div class="card" id="subjectCard">
        <div class="image-container">
          <img src="${image}" alt="${name}">
        </div>
        <div class="content">
          <h4>${name}</h4>
          <p>${career}</p>
          <p class="credits">${credits} credits</p>
          <div class="stars">
            ${stars}
          </div>
        </div>
      </div>
    `;

    // Agregar el event listener después de renderizar
    const card = this.shadowRoot?.querySelector("#subjectCard");
    if (card) {
      card.addEventListener("click", this.handleClick);
    } else {
      console.error("SubjectCard: Could not find #subjectCard element");
    }
  }

  attributeChangedCallback(name: keyof SubjectCardAttributes, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Función para generar un hash numérico de un string
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    return hash;
  }
}

export default SubjectCard;
