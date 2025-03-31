class SubjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ['name', 'career', 'credits', 'nucleus'];
    }

    connectedCallback() {
        this.render();
        this.setupStarInteraction();
    }

    setupStarInteraction() {
        const stars = this.shadowRoot?.querySelectorAll('.star-icon');
        if (stars) {
            stars.forEach((star, index) => {
                star.addEventListener('mouseover', () => {
                    stars.forEach((s, i) => {
                        s.setAttribute('fill', i <= index ? '#5354ED' : '#ccc');
                    });
                });

                star.addEventListener('mouseout', () => {
                    stars.forEach((s, i) => {
                        s.setAttribute('fill', i < 3 ? '#5354ED' : '#ccc');
                    });
                });
            });
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.render();
            this.setupStarInteraction();
        }
    }

    render() {
        const name = this.getAttribute('name') || 'Name not specified';
        const career = this.getAttribute('career') || 'Career not specified';
        const credits = this.getAttribute('credits') || '0';
        const nucleus = this.getAttribute('nucleus') || 'Nucleus not specified';
        const randomId = Math.floor(Math.random() * 1000);
        const image = `https://picsum.photos/id/${randomId}/250/150`;

        const stars = Array(5).fill(0).map((_, index) => `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${index < 3 ? '#5354ED' : '#ccc'}" class="star-icon">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
        `).join('');

        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                .card {
                    max-width: 300px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    background-color: #EFF0FD;
                    padding: 0;
                    text-align: left;
                    border: 1px solid rgb(0, 0, 0);
                    transition: all 0.3s ease;
                    overflow: hidden;
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

                .credits {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #5354ED;
                    margin: 0 0 12px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .credits::before {
                    content: "•";
                    color: #5354ED;
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
                    content: '';
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
                    <p>${career}</p>
                    <p>${nucleus}</p>
                    <p class="credits">${credits} credits</p>
                    <div class="stars">
                        ${stars}
                    </div>
                </div>
            </div>
        `;
    }
}

export default SubjectCard;
