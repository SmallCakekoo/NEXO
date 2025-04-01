class TeacherDetailCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ['name', 'subject', 'rating', 'image'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute('name') || 'Jimmy Ramirez';
        const subject = this.getAttribute('subject') || 'Logic & Argumentation';
        const rating = parseInt(this.getAttribute('rating') || '0');
        const imageId = this.getAttribute('image') || '425';
        
        // Use a placeholder image service with a local fallback
        const image = `https://picsum.photos/id/${imageId}/200/200`;
        
        // Generate star rating
        const stars = Array(5).fill(0).map((_, i) => 
            `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="${i < rating ? 'filled' : ''}">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>`
        ).join('');
        
        this.shadowRoot!.innerHTML = `
            <style>
                .teacher-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: white;
                    border-radius: 16px;
                    padding: 30px 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 6px 18px rgba(83, 84, 237, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .teacher-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(83, 84, 237, 0.15);
                }

                .teacher-image {
                    width: 180px;
                    height: 180px;
                    border-radius: 8px;
                    object-fit: cover;
                    margin-bottom: 24px;
                    border: 3px solid #f5f7ff;
                    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
                    background-color: #f0f2fa;
                }

                .teacher-name {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 6px 0;
                    color: #000;
                    text-align: center;
                }

                .teacher-subject {
                    font-size: 18px;
                    color: #5354ED;
                    margin: 6px 0 18px;
                    text-align: center;
                    font-weight: 500;
                }

                .rating {
                    display: flex;
                    gap: 10px;
                    margin-top: 6px;
                    justify-content: center;
                }
                
                .rating svg {
                    width: 32px;
                    height: 32px;
                    fill: #e0e0fe;
                    stroke: none;
                    transition: fill 0.2s ease;
                }
                
                .rating svg.filled {
                    fill: #5354ED;
                }

                @media (min-width: 768px) {
                    .teacher-card {
                        padding: 36px;
                    }

                    .teacher-image {
                        width: 200px;
                        height: 200px;
                    }
                }
            </style>
            <div class="teacher-card">
                <img class="teacher-image" src="${image}" alt="${name}" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22100%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3E${name.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E';">
                <h2 class="teacher-name">${name}</h2>
                <p class="teacher-subject">${subject}</p>
                <div class="rating">
                    ${stars}
                </div>
            </div>
        `;
    }
}

export default TeacherDetailCard; 