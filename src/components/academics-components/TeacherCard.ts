import { TeacherCardAttributes } from "../../types/academics/TeacherCard.types";
import { store, State, Rating } from "../../flux/Store";

class TeacherCard extends HTMLElement {
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    console.log("TeacherCard: Constructor called");
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): (keyof TeacherCardAttributes)[] {
    return ["name", "subject", "nucleus", "rating", "image", "id"];
  }

  connectedCallback() {
    console.log("TeacherCard: connectedCallback");
    this.render();
    this.setupStarInteraction();
    this.setupCardClickHandler();
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

  // Adds click event to the card for the navigation
  setupCardClickHandler() {
    console.log("TeacherCard: setupCardClickHandler");
    const card = this.shadowRoot?.querySelector(".card");
    console.log("TeacherCard: querySelector(.card) result", card);
    if (card) {
      console.log("TeacherCard: Attaching click listener to card");
      card.addEventListener("click", () => {
        console.log("TeacherCard: card clicked");
        // Guardar los datos del profesor en sessionStorage
        const teacherData = {
          name: this.getAttribute("name") || "",
          subject: this.getAttribute("subject") || "",
          nucleus: this.getAttribute("nucleus") || "",
          rating: this.getAttribute("rating") || "0", // Store the original rating attribute
          image: this.getAttribute("image") || Math.floor(Math.random() * 30).toString()
        };
        
        sessionStorage.setItem("selectedTeacher", JSON.stringify(teacherData));
        
        const customEvent = new CustomEvent("navigate", {
          detail: "/teacher-detail",
        });
        document.dispatchEvent(customEvent);
      });
    } else {
      console.error("TeacherCard: Could not find .card element to attach listener");
    }
  }

  private calculateAverageRating(): number {
    const teacherName = this.getAttribute("name") || "";
    const state = store.getState();
    const ratings = state.teacherRatings[teacherName] || [];
    
    if (ratings.length === 0) {
      return 0;
    }
    
    const sum = ratings.reduce((acc: number, curr: Rating) => acc + curr.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  }

  // Adds hover interaction to the star icons to simulate rating behavior (only visual)
  setupStarInteraction() {
    const rating = this.calculateAverageRating();
    const stars = this.shadowRoot?.querySelectorAll(".star-icon");
    if (stars) {
      stars.forEach((star, index) => {
        star.addEventListener("mouseover", () => {
          stars.forEach((s, i) => {
            s.setAttribute("fill", i <= index ? "#5354ED" : "#ccc");
          });
        });

        star.addEventListener("mouseout", () => {
          stars.forEach((s, i) => {
            s.setAttribute("fill", i < rating ? "#5354ED" : "#ccc");
          });
        });
      });
    }
  }

  attributeChangedCallback(_name: keyof TeacherCardAttributes, oldValue: string, newValue: string) {
    console.log("TeacherCard: attributeChangedCallback", _name, oldValue, newValue);
    if (oldValue !== newValue) {
          console.log('funciona eche')
      this.render();
      this.setupStarInteraction();
      this.setupCardClickHandler();
    }
  }

  render() {
    const name = this.getAttribute("name") || "Name not specified";
    const subject = this.getAttribute("subject") || "Subject not specified";
    const nucleus = this.getAttribute("nucleus") || "Nucleus not specified";
    const rating = this.calculateAverageRating();
    const randomId = Math.floor(Math.random() * 30);
    const image = `https://picsum.photos/id/${randomId}/250/150`;

    const stars = Array(5)
      .fill(0)
      .map(
        (_, index) => `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${index < rating ? "#5354ED" : "#ccc"}" class="star-icon">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
        `
      )
      .join("");

    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
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
    
        .subject {
          font-size: 1rem;
          font-weight: 600;
          color: var(--nexopurple);
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
    
        .subject::before {
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
    
        .card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          pointer-events: none;
        }
      </style>
    
      <div class="card">
        <div class="image-container">
          <img src="${image}" alt="${name}">
        </div>
        <div class="content">
          <h4>${name}</h4>
          <p class="subject">${subject}</p>
          <p>${nucleus}</p>
          <div class="stars">
            ${stars}
          </div>
        </div>
      </div>
    `;
  }
}

export default TeacherCard;
