import { SubjectDetailCardAttributes } from "../../types/subject-detail/SubjectDetailCard.types";

class SubjectDetailCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Specifies which attributes to observe for changes
  static get observedAttributes(): (keyof SubjectDetailCardAttributes)[] {
    return ["name", "career", "credits", "rating", "image"];
  }

  connectedCallback() {
    this.render();
  }

  // Called when one of the observed attributes is changed
  attributeChangedCallback(
    name: keyof SubjectDetailCardAttributes,
    oldValue: string,
    newValue: string
  ) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    // Retrieves attribute values or assigns default values (bc this is static for now)
    const name = this.getAttribute("name") || "Logic & Argumentation";
    const career = this.getAttribute("career") || "Computer Science";
    const credits = this.getAttribute("credits") || "3";
    const rating = parseInt(this.getAttribute("rating") || "3");
    const imageId = this.getAttribute("image") || "301";

    const image = `https://picsum.photos/id/${imageId}/400/300`;

    const stars = Array(5)
      .fill(0)
      .map(
        (_, index) => `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="${index < rating ? "filled" : ""}" fill="${index < rating ? "#5354ED" : "#e0e0fe"}" stroke="none" class="star-icon">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
        `
      )
      .join("");

    this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/styles/components/subject-detail/SubjectDetailCard.css">
            <div class="subject-card">
                <img class="subject-image" src="${image}" alt="${name}" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22150%22%20font-size%3D%2240%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3E${name.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E';">
                <div class="subject-info">
                    <h2 class="subject-name">${name}</h2>
                    <p class="subject-career">${career}</p>
                    <div class="subject-details">
                        <div class="detail-item">
                            <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                            </svg>
                            ${credits} Créditos
                        </div>
                    </div>
                    <div class="rating">
                        ${stars}
                    </div>
                </div>
            </div>
        `;
  }
}

export default SubjectDetailCard;
