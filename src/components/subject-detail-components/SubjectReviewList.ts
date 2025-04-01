type SubjectReview = {
    author: string;
    date: string;
    rating: number;
    text: string;
    image?: string;
}

class SubjectReviewList extends HTMLElement {
    private reviews: SubjectReview[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        // Add sample review data
        this.reviews = [
            {
                author: 'Maria García',
                date: '10/02/25',
                rating: 4,
                text: 'Excellent subject. The content is very interesting and useful for professional development.',
                image: 'https://i.pravatar.cc/150?img=5'
            },
            {
                author: 'Carlos Mendoza',
                date: '05/01/25',
                rating: 5,
                text: 'One of the best subjects I have taken. Very practical and well organized.',
                image: 'https://i.pravatar.cc/150?img=12'
            }
        ];

        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for new review submissions
        document.addEventListener('subject-review-submitted', ((event: CustomEvent) => {
            this.reviews.unshift(event.detail);
            this.render();
        }) as EventListener);
    }

    addReview(review: SubjectReview) {
        this.reviews.unshift(review);
        this.render();
    }

    render() {
        const reviewsHTML = this.reviews.map(review => {
            const stars = Array(5).fill(0).map((_, index) => `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                    fill="${index < review.rating ? '#5354ED' : '#e0e0fe'}" class="star-icon">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            `).join('');

            // Generate a fallback avatar based on the first letter of the author's name
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
        }).join('');

        this.shadowRoot!.innerHTML = `
            <style>
                .reviews-container {
                    background-color: white;
                    border-radius: 16px;
                    padding: 30px 24px;
                    box-shadow: 0 6px 18px rgba(83, 84, 237, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .reviews-container:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(83, 84, 237, 0.15);
                }
                
                .reviews-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    color: #000;
                    position: relative;
                    padding-bottom: 10px;
                }
                
                .reviews-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 50px;
                    height: 3px;
                    background-color: #5354ED;
                    border-radius: 2px;
                }
                
                .review-item {
                    background-color: #f8f9fd;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                    box-shadow: 0 3px 10px rgba(83, 84, 237, 0.06);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
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
                    border: 2px solid white;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
                    background-color: #f0f2fa;
                }
                
                .user-name {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #000;
                }
                
                .review-date {
                    font-size: 13px;
                    color: #5354ED;
                }
                
                .review-rating {
                    display: flex;
                    gap: 4px;
                    padding: 5px 10px;
                    background-color: white;
                    border-radius: 20px;
                    box-shadow: 0 2px 6px rgba(83, 84, 237, 0.06);
                }
                
                .review-text {
                    margin: 0;
                    font-size: 15px;
                    line-height: 1.5;
                    color: #333;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 30px 16px;
                    color: #555;
                    font-size: 15px;
                    background-color: #f8f9fd;
                    border-radius: 12px;
                }
                
                @media (min-width: 768px) {
                    .reviews-container {
                        padding: 36px;
                    }
                    
                    .review-item {
                        padding: 24px;
                    }
                }
            </style>
            <div class="reviews-container">
                <h3 class="reviews-title">Subject Reviews</h3>
                ${reviewsHTML || `<div class="empty-state">No reviews yet. Be the first to leave one!</div>`}
            </div>
        `;
    }
}

export default SubjectReviewList; 