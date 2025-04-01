import teachersJson from '../../data/teachers.json';

export interface Teacher {
    name: string;
    subject: string;
    nucleus: string;
    rating: string;
    image: string;
}

class TeachersContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.loadTeachers();
    }

    loadTeachers() {
        try {
            const teachers: Teacher[] = teachersJson.teachers;

            const row = this.shadowRoot?.querySelector('.row');
            if (row) {
                teachers.forEach(teacher => {
                    const col = document.createElement('div');
                    col.className = 'col';

                    const card = document.createElement('teacher-card');
                    card.setAttribute('name', teacher.name);
                    card.setAttribute('subject', teacher.subject);
                    card.setAttribute('nucleus', teacher.nucleus);
                    card.setAttribute('rating', teacher.rating);
                    card.setAttribute('image', teacher.image);

                    col.appendChild(card);
                    row.appendChild(col);
                });
            }
        } catch (error) {
            console.error('Error loading teachers:', error);
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

export default TeachersContainer; 