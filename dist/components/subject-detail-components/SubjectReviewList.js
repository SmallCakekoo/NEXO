class SubjectReviewList extends HTMLElement {
    constructor() {
        super();
        this.reviews = [];
        this.attachShadow({ mode: "open" });
    }
    // Static reviews for now (Mock data)
    connectedCallback() {
        this.reviews = [
            {
                author: "John Smith",
                date: "20/03/25",
                rating: 5,
                text: "The professor's explanations are crystal clear. Highly recommend taking detailed notes during lectures.",
                image: "https://i.pravatar.cc/150?img=2",
            },
            {
                author: "Michael Brown",
                date: "17/03/25",
                rating: 5,
                text: "The practical assignments are challenging but rewarding. The feedback is constructive and helpful.",
                image: "https://i.pravatar.cc/150?img=4",
            },
            {
                author: "Emma Wilson",
                date: "16/03/25",
                rating: 4,
                text: "Make sure to attend all the tutoring sessions - they're invaluable for exam preparation.",
                image: "https://i.pravatar.cc/150?img=5",
            },
            {
                author: "David Lee",
                date: "15/03/25",
                rating: 5,
                text: "The course materials are well-organized and the online resources are comprehensive.",
                image: "https://i.pravatar.cc/150?img=6",
            },
        ];
        this.render();
        this.setupEventListeners();
    }
    // Sets up event listeners for the review list
    setupEventListeners() {
        document.addEventListener("review-submitted", ((event) => {
            this.reviews.unshift(event.detail); // Adds new review to the top of the list
            this.render();
        }));
    }
    // Public method to add a review from external code
    addReview(review) {
        this.reviews.unshift(review);
        this.render();
    }
    render() {
        const reviewsHTML = this.reviews
            .map((review) => {
            const stars = Array(5)
                .fill(0)
                .map((_, index) => `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                    fill="${index < review.rating ? "#5354ED" : "#e0e0fe"}" class="star-icon">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            `)
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
        this.shadowRoot.innerHTML = `
          <link rel="stylesheet" href="/styles/components/subject-detail/SubjectReviewLists.css">
            
            <div class="reviews-container">
                <h3 class="reviews-title">Reviews</h3>
                ${reviewsHTML}
            </div>
        `;
    }
}
export default SubjectReviewList;
//# sourceMappingURL=SubjectReviewList.js.map