import { Review } from "../../types/teacher-detail/TeacherReviewList.types";
import { fetchTeachers } from "../../services/TeacherService";
import { teachers } from "../../types/academics/TeachersContainer.types";
import { store, State } from '../../flux/Store';

// Cache estática para almacenar las reseñas por profesor
const reviewsCache: Record<string, Review[]> = {};
// Tiempo de vida de la caché en milisegundos (5 minutos)
const CACHE_TTL = 5 * 60 * 1000;
// Último tiempo de actualización por profesor
const lastFetchTime: Record<string, number> = {};

class TeacherReviewList extends HTMLElement {
  private reviews: Review[] = [];
  private teacherName: string = "";
  private isLoading: boolean = false;
  private abortController: AbortController | null = null;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["teacher-name"];
  }

  private shouldFetchFromNetwork(teacherName: string): boolean {
    // Si no está en caché o ha pasado más tiempo que el TTL
    return !reviewsCache[teacherName] || 
           !lastFetchTime[teacherName] || 
           (Date.now() - lastFetchTime[teacherName] > CACHE_TTL);
  }

  private async fetchFromNetwork(): Promise<Review[]> {
    if (this.abortController) {
      this.abortController.abort();
    }
    
    this.abortController = new AbortController();
    
    try {
      const data = await fetchTeachers();
      const teacher = data.teachers.find((t: teachers) => t.name === this.teacherName);
      
      if (teacher && teacher.reviews) {
        // Actualizar caché
        reviewsCache[this.teacherName] = teacher.reviews;
        lastFetchTime[this.teacherName] = Date.now();
        return teacher.reviews;
      }
      return [];
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error fetching reviews:', error);
      }
      return [];
    } finally {
      this.abortController = null;
    }
  }

  private updateReviews(reviews: Review[]) {
    this.reviews = reviews;
    this.render();
  }

  private async fetchReviews() {
    if (!this.teacherName || this.isLoading) {
      return;
    }

    this.isLoading = true;
    try {
      const state = store.getState();
      const teacherRatings = state.teacherRatings[this.teacherName] || [];
      this.reviews = teacherRatings.map(rating => ({
        rating: rating.rating,
        text: rating.comment,
        date: new Date(rating.timestamp).toLocaleDateString(),
        author: rating.author || 'Anonymous',
        image: rating.image || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      }));
      this.render();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      this.reviews = [];
      this.render();
    } finally {
      this.isLoading = false;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "teacher-name" && oldValue !== newValue) {
      this.teacherName = newValue;
      this.fetchReviews();
    }
  }

  connectedCallback() {
    this.fetchReviews();
    this.setupEventListeners();
    this.unsubscribeStore = store.subscribe(this.handleStoreChange.bind(this));
  }

  disconnectedCallback() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  setupEventListeners() {
    // Event listener removed to prevent duplicate submissions
    // The event is now only handled by TeacherCommentsContainer
  }

  handleStoreChange(state: State) {
    if (!this.isConnected || !this.teacherName) {
      return;
    }
    const latestRatings = state.teacherRatings[this.teacherName] || [];
    this.reviews = latestRatings.map(rating => ({
      rating: rating.rating,
      text: rating.comment,
      date: new Date(rating.timestamp).toLocaleDateString(),
      author: rating.author || 'Anonymous',
      image: rating.image || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    }));
    this.render();
  }

  addReview(review: Review) {
    console.warn('addReview method in TeacherReviewList called. Consider using the store for updates.');
    store.saveTeacherReview(this.teacherName, review);
    this.reviews = store.getTeacherReviews(this.teacherName);
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

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

        const defaultAvatar = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22150%22%20height%3D%22150%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2275%22%20font-size%3D%2250%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3E${review.author?.charAt(0) || 'U'}%3C%2Ftext%3E%3C%2Fsvg%3E`;
        const userImage = review.image || defaultAvatar;

        return `
                <div class="review-item">
                    <div class="review-header">
                        <div class="user-info">
                            <img src="${userImage}" alt="${review.author || 'User'}" class="user-avatar" onerror="this.onerror=null; this.src='${defaultAvatar}';">
                            <div>
                                <h4 class="user-name">${review.author || 'Anonymous'}</h4>
                                <div class="review-date">${review.date || new Date().toLocaleDateString()}</div>
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
