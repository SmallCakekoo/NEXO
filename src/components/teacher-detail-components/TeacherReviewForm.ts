class TeacherReviewForm extends HTMLElement {
  private selectedRating: number = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const stars = this.shadowRoot?.querySelectorAll(".star-rating svg");
    const publishButton = this.shadowRoot?.querySelector(".publish-button");
    const reviewInput = this.shadowRoot?.querySelector(".review-input") as HTMLTextAreaElement;

    stars?.forEach((star, index) => {
      star.addEventListener("click", () => {
        this.selectedRating = index + 1;
        this.updateStars();
      });

      star.addEventListener("mouseover", () => {
        stars.forEach((s, i) => {
          s.classList.toggle("hovered", i <= index);
        });
      });

      star.addEventListener("mouseout", () => {
        stars.forEach((s) => s.classList.remove("hovered"));
      });
    });

    publishButton?.addEventListener("click", () => {
      if (this.selectedRating === 0) {
        alert("Please select a rating before publishing your review.");
        return;
      }

      const reviewText = reviewInput?.value || "";

      // You would typically send this data to a server
      console.log("Review submitted:", {
        rating: this.selectedRating,
        text: reviewText,
      });

      // Generate a user avatar with the first letter of "Current User"
      const defaultAvatar = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22150%22%20height%3D%22150%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2275%22%20font-size%3D%2250%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3EC%3C%2Ftext%3E%3C%2Fsvg%3E`;

      // Clear form after submission
      const oldRating = this.selectedRating;
      this.selectedRating = 0;
      if (reviewInput) reviewInput.value = "";
      this.updateStars();

      // For demo purposes, add the review to the page
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

  updateStars() {
    const stars = this.shadowRoot?.querySelectorAll(".star-rating svg");
    stars?.forEach((star, index) => {
      star.classList.toggle("selected", index < this.selectedRating);
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
           <link rel="stylesheet" href="/styles/components/teacher-detail/TeacherReviewForm.css">
            <div class="review-form">
                <h3 class="form-title">Leave your review:</h3>
                <div class="star-rating">
                    ${Array(5)
                      .fill(0)
                      .map(
                        () => `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                    `
                      )
                      .join("")}
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

export default TeacherReviewForm;
