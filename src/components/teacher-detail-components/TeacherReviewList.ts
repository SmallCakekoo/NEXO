import { Review } from "../../types/teacher-detail/TeacherReviewList.types";

class TeacherReviewList extends HTMLElement {
  private reviews: Review[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Static reviews for now (Mock data)
  connectedCallback() {
    this.reviews = [
      {
        author: "Juan Telón",
        date: "16/03/25",
        rating: 4,
        text: "Make sure to assist to all his monitorings",
        image: "https://i.pravatar.cc/150?img=1",
      },
    ];

    this.render();
    this.setupEventListeners();
  }

  // Sets up event listeners for the review list
  setupEventListeners() {
    document.addEventListener("review-submitted", ((event: CustomEvent) => {
      this.reviews.unshift(event.detail);
      this.render();
    }) as EventListener);
  }

  // Public method to add a review from external code
  addReview(review: Review) {
    this.reviews.unshift(review);
    this.render();
  }

  render() {
    const reviewsHTML = this.reviews
      .map((review) => {
        const stars = Array(5)
          .fill(0)
          .map(
            (_, index) => `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                    fill="${index < review.rating ? "#5354ED" : "#e0e0fe"}" class="star-icon">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            `
          )
          .join("");

        const defaultAvatar = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22150%22%20height%3D%22150%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2275%22%20font-size%3D%2250%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3E${review.author.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E`;
        const userImage = review.image || defaultAvatar;

        return `
                <div class="review-item">
                    <div class="review-header">
                        <div class="user-info">
                            <img src="${userImage}" alt="${review.author}" class="user-avatar" onerror="this.onerror=null; this.src='${defaultAvatar}';">
                            <div>
                                <h4 class="user-name">${review.author}</h4>
                                <div class="review-date">${review.date}</div>
                            </div>
                        </div>
                        <div class="review-rating">
                            ${stars}
                        </div>
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
            `;
      })
      .join("");

    this.shadowRoot!.innerHTML = `
           <style>
                @import url("../colors.css");

.reviews-title {
  top: -10;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #000;
  position: relative;
  padding-bottom: 1px;
}

.reviews-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 70px;
  height: 3px;
  background-color: var(--nexopurple);
  border-radius: 2px;
}

.review-item {
  background-color: var(--nexolightwhite);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 3px 10px rgba(83, 84, 237, 0.06);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(83, 84, 237, 0.1);
}

.review-item:last-child {
  margin-bottom: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--nexowhite);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  background-color: var(--nexowhite);
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--nexoblack);
}

.review-date {
  font-size: 13px;
  color: var(--nexopurple);
}

.review-rating {
  display: flex;
  gap: 4px;
  padding: 5px 10px;
  background-color: var(--nexowhite);
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(83, 84, 237, 0.06);
}

.review-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--nexogray);
}

.empty-state {
  text-align: center;
  padding: 30px 16px;
  color: var(--nexogray);
  font-size: 15px;
  background-color: var(--nexowhite);
  border-radius: 12px;
}

@media (min-width: 576px) {
  .reviews-container {
    padding: 0px 36px 36px 36px;
  }

  .review-item {
    padding: 24px;
  }
}

                </style> 
                <div class="reviews-container">
                <h3 class="reviews-title">Reviews</h3>
                ${reviewsHTML || `<div class="empty-state">No reviews yet. Be the first to leave one!</div>`}
            </div>
        `;
  }
}

export default TeacherReviewList;
