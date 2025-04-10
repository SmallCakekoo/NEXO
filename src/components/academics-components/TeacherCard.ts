import { TeacherCardAttributes } from "../../types/academics/TeacherCard.types";

class TeacherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): (keyof TeacherCardAttributes)[] {
    return ["name", "subject", "nucleus", "rating", "image", "id"];
  }

  connectedCallback() {
    this.render();
    this.setupStarInteraction();
    this.setupCardClickHandler();
  }

  // Adds click event to the card for the navigation
  setupCardClickHandler() {
    const card = this.shadowRoot?.querySelector(".card");
    card?.addEventListener("click", () => {
      const customEvent = new CustomEvent("navigate", {
        bubbles: true,
        composed: true,
        detail: "/teacher-detail",
      });
      document.dispatchEvent(customEvent);
    });
  }

  // Adds hover interaction to the star icons to simulate rating behavior (only visual)
  setupStarInteraction() {
    const rating = parseInt(this.getAttribute("rating") || "0");
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

  attributeChangedCallback(name: keyof TeacherCardAttributes, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
      this.setupStarInteraction();
      this.setupCardClickHandler();
    }
  }

  render() {
    const name = this.getAttribute("name") || "Name not specified";
    const subject = this.getAttribute("subject") || "Subject not specified";
    const nucleus = this.getAttribute("nucleus") || "Nucleus not specified";
    const rating = parseInt(this.getAttribute("rating") || "0");
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
            <link rel="stylesheet" href="/styles/components/academics/TeacherCard.css">
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
