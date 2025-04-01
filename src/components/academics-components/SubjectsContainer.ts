import subjectsJson from '../../data/subjects.json';

export interface Subject {
    name: string;
    career: string;
    credits: string;
    image: string;
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
                    
                    col.appendChild(card);
                    row.appendChild(col);
                });
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                .container {
                    padding: 20px;
                }

                .row {
                    margin: 0 -10px;
                }

                .col {
                    padding: 10px;
                }

                @media (max-width: 576px) {
                    .container {
                        padding: 0;
                        font-size: 0.7rem;
                    }

                    .row {
                        margin: 0 -2px;
                    }

                    .col {
                        padding: 2px;
                    }

                    :host {
                        font-size: 0.7rem;
                    }

                    .g-4 {
                        gap: 0.5rem !important;
                    }
                }
            </style>
            <div class="container">
                <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
                </div>
            </div>
        `;
    }
}

export default SubjectsContainer; 