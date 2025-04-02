import subjectsJson from '../../data/subjects.json';

export interface Subject {
    name: string;
    career: string;
    credits: string;
    image: string;
    rating: string;
}

class SubjectsContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.loadSubjects();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                .container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .row {
                    margin: 0 -10px;
                    display: flex;
                    flex-wrap: wrap;
                }

                .col {
                    padding: 10px;
                    display: flex;
                    justify-content: center;
                }

                @media (max-width: 576px) {
                    .container {
                        padding: 10px;
                        font-size: 0.7rem;
                    }

                    .row {
                        margin: 0 -5px;
                    }

                    .col {
                        padding: 5px;
                    }

                    :host {
                        font-size: 0.7rem;
                    }

                    .g-2 {
                        gap: 0.5rem !important;
                    }
                }

                @media (min-width: 577px) and (max-width: 768px) {
                    .container {
                        padding: 15px;
                    }

                    .row {
                        margin: 0 -8px;
                    }

                    .col {
                        padding: 8px;
                    }
                }
            </style>
            <div class="container">
                <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
                </div>
            </div>
        `;
    }

    loadSubjects() {
        try {
            const subjects: Subject[] = subjectsJson.subjects;

            const row = this.shadowRoot?.querySelector('.row');
            if (row) {
                subjects.forEach(subject => {
                    const col = document.createElement('div');
                    col.className = 'col';
                    
                    const card = document.createElement('subject-card');
                    card.setAttribute('name', subject.name);
                    card.setAttribute('career', subject.career);
                    card.setAttribute('credits', subject.credits);
                    card.setAttribute('image', subject.image);
                    card.setAttribute('rating', subject.rating);
                    
                    col.appendChild(card);
                    row.appendChild(col);
                });
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    }
}

export default SubjectsContainer; 