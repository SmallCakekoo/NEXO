class SubjectReviewForm extends HTMLElement {
  private selectedRating: number = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  // Sets up all event listeners like star rating interaction and publish button click
  setupEventListeners() {
    const stars = this.shadowRoot?.querySelectorAll(".star-rating svg");
    const publishButton = this.shadowRoot?.querySelector(".publish-button");
    const reviewInput = this.shadowRoot?.querySelector(".review-input") as HTMLTextAreaElement;

    // Adds click, hover, and mouseout events for each star icon
    stars?.forEach((star, index) => {
      // When a star is clicked, update the selected rating
      star.addEventListener("click", () => {
        this.selectedRating = index + 1;
        this.updateStars();
      });

      // Highlight stars on mouseover
      star.addEventListener("mouseover", () => {
        stars.forEach((s, i) => {
          s.classList.toggle("hovered", i <= index);
        });
      });

      // Remove highlight on mouseout
      star.addEventListener("mouseout", () => {
        stars.forEach((s) => s.classList.remove("hovered"));
      });
    });

    // Handles the publish button click
    publishButton?.addEventListener("click", () => {
      if (this.selectedRating === 0) {
        alert("Por favor selecciona una calificación antes de publicar tu reseña.");
        return;
      }

      const reviewText = reviewInput?.value || "";

      // TODO: Logs review data for now (probably can be replaced with backend logic)
      // console.log("Review submitted:", {
      //   rating: this.selectedRating,
      //   text: reviewText,
      // });

      // Fallback avatar if user doesn't have one
      const defaultAvatar = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22150%22%20height%3D%22150%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2275%22%20font-size%3D%2250%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3EC%3C%2Ftext%3E%3C%2Fsvg%3E`;

      // Reset form
      const oldRating = this.selectedRating;
      this.selectedRating = 0;
      if (reviewInput) reviewInput.value = "";
      this.updateStars();

      //Dispatch a custom event with review data to parent component
      this.dispatchEvent(
        new CustomEvent("review-submitted", {
          detail: {
            rating: oldRating,
            text: reviewText,
            date: new Date().toLocaleDateString(),
            author: "Current User",
            image: defaultAvatar,
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  // Updates the visual appearance of stars based on the rating
  updateStars() {
    const stars = this.shadowRoot?.querySelectorAll(".star-rating svg");
    stars?.forEach((star, index) => {
      star.classList.toggle("selected", index < this.selectedRating);
    });
  }

  render() {
    const stars = Array(5)
      .fill(0)
      .map(
        () => `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
        `
      )
      .join("");

    this.shadowRoot!.innerHTML = `
          <style>
@import url('../colors.css');

.form-title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 10px;
  color: var(--nexoblack);
  position: relative;
  padding-bottom: 3px;
  text-align: center;
}

.form-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 3px;
  background-color: var(--nexopurple);
  border-radius: 2px;
}

.star-rating {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.star-rating svg {
  width: 40px;
  height: 40px;
  cursor: pointer;
  fill: var(--nexolightwhite);
  stroke: none;
  transition: all 0.3s ease;
}

.star-rating svg:hover {
  transform: scale(1.1);
}

.star-rating svg.selected,
.star-rating svg.hovered {
  fill: var(--nexopurple);
}

.review-input {
  width: 100%;
  min-height: 120px;
  border: 1px solid var(--nexolightwhite);
  border-radius: 10px;
  padding: 14px;
  font-family: inherit;
  font-size: 15px;
  margin-bottom: 20px;
  resize: vertical;
  background-color: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

@media (max-width: 576px) {
  .review-input {
    min-height: 100px;
    font-size: 14px;
    padding: 10px;
  }
}

@media (max-width: 576px) {
  .review-input {
    min-height: 80px;
    font-size: 13px;
    padding: 8px;
  }
}

.review-input:focus {
  outline: none;
  border-color: var(--nexopurple);
  box-shadow: 0 0 0 3px rgba(83, 84, 237, 0.15);
  background-color: white;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.publish-button {
  background-color: var(--nexopurple);
  color: var(--nexowhite);
  font-size: 15px;
  border: 2px solid var(--nexoblack);
  padding: 10px 24px;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease-in-out;
}

.publish-button:hover {
  filter: brightness(1.2);
  transform: scale(1.05);
  -webkit-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
  box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
}

.publish-button:active {
  transform: scale(0.95);
  -webkit-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
  filter: brightness(0.8);
}

.publish-button svg {
  width: 18px;
  height: 18px;
  fill: var(--nexowhite);
}

               </style>
                <div class="review-form">
                <h3 class="form-title">Leave your review:</h3>
                <div class="star-rating">
                    ${stars}
                </div>
                <textarea class="review-input" placeholder="Write something..."></textarea>
                <div class="button-container">
                    <button class="publish-button">
                        Publish
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
  }
}

export default SubjectReviewForm;
