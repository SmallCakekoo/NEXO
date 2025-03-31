class TeacherCardOld extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ['name', 'subject', 'nucleus', 'rating', 'image'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const name = this.getAttribute('name') || 'Name not specified';
        const subject = this.getAttribute('subject') || 'Subject not specified';
        const nucleus = this.getAttribute('nucleus') || 'Nucleus not specified';
        const rating = parseInt(this.getAttribute('rating') || '0');
        const randomId = Math.floor(Math.random() * 1000);
        const image = `https://picsum.photos/id/${randomId}/250/150`;

        const stars = Array(5).fill(0).map((_, index) => `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${index < rating ? '#5354ED' : '#ccc'}" class="star-icon">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
        `).join('');

        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                .card {
                    max-width: 300px;
                    border-radius: 15px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    background-color: #f4f5ff;
                    padding: 20px;
                    text-align: center;
                    border: 1px solid #000000;
                    transition: transform 0.2s;
                }

                .card:hover {
                    transform: translateY(-5px);
                }

                .card img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 10px;
                    display: block;
                    margin: 0 auto;
                }

                .card h4 {
                    font-weight: bold;
                    margin-top: 10px;
                    color: #333;
                }

                .card p {
                    font-style: italic;
                    color: #555;
                    margin: 5px 0;
                }

                .subject {
                    font-weight: bold;
                    color: #333;
                }

                .stars {
                    display: flex;
                    justify-content: center;
                    gap: 5px;
                    margin-top: 10px;
                }

                .star-icon {
                    transition: fill 0.2s;
                }
            </style>
            <div class="card">
                <img src="${image}" alt="${name}">
                <h4>${name}</h4>
                <p>${subject}</p>
                <p class="subject">${nucleus}</p>
                <div class="stars">
                    ${stars}
                </div>
            </div>
        `;
    }
}

export default TeacherCardOld;
