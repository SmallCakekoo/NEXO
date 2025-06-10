import { subjects } from "../../types/academics/SubjectsContainer.types";
import { fetchSubjects } from "../../services/SubjectService";
import store from "../../flux/Store";

class SubjectsContainer extends HTMLElement {
  private subjects: subjects[] = [];
  private currentPage: number = 1;
  private itemsPerPage: number = 8;

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
    }

    .row {
      margin: 0 -10px;
    }

    .col {
      padding: 10px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      gap: 10px;
    }

    .pagination button {
      padding: 8px 16px;
      border: 1px solid var(--nexolightwhite);
      background-color: var(--nexolightwhite);
      cursor: pointer;
      border-radius: 8px;
      color: var(--nexopurple);
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .pagination button:hover {
      background-color: var(--nexolightwhite);
      transform: translateY(-2px);
    }

    .pagination button.active {
      background-color: var(--nexopurple);
      color: var(--nexolightwhite);
      border-color: var(--nexopurple);
    }

    .pagination button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
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

      .pagination button {
        padding: 6px 12px;
        font-size: 0.7rem;
      }
    }
  </style>
  <div class="container">
    <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
    </div>
    <div class="pagination"></div>
  </div>
`;
  }

  async loadSubjects() {
    try {
      const response = await fetchSubjects();
      this.subjects = response.subjects;
      this.renderPage();
      this.renderPagination();
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  }

  renderPage() {
    const row = this.shadowRoot?.querySelector(".row");
    if (row) {
      
      row.innerHTML = "";

        const state = store.getState();
        const subjectList = state.queryResult ?  state.queryResult as subjects[]: this.subjects;
      
      
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = Math.min(startIndex + this.itemsPerPage, this.subjects.length);

      for (let i = startIndex; i < endIndex; i++) {
        const subject = subjectList[i];
        const col = document.createElement("div");
        col.className = "col";

        const card = document.createElement("subject-card");
        card.setAttribute("name", subject.name);
        card.setAttribute("career", subject.career);
        card.setAttribute("credits", subject.credits);
        card.setAttribute("image", subject.image);
        card.setAttribute("rating", subject.rating);

        col.appendChild(card);
        row.appendChild(col);
      }
    }
  }

  renderPagination() {
    const paginationContainer = this.shadowRoot?.querySelector(".pagination");
    if (paginationContainer) {
      paginationContainer.innerHTML = "";

      const totalPages = Math.ceil(this.subjects.length / this.itemsPerPage);

      const prevButton = document.createElement("button");
      prevButton.textContent = "«";
      prevButton.disabled = this.currentPage === 1;
      prevButton.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderPage();
          this.renderPagination();
        }
      });
      paginationContainer.appendChild(prevButton);

      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i.toString();
        if (i === this.currentPage) {
          pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
          this.currentPage = i;
          this.renderPage();
          this.renderPagination();
        });

        paginationContainer.appendChild(pageButton);
      }

      const nextButton = document.createElement("button");
      nextButton.textContent = "»";
      nextButton.disabled = this.currentPage === totalPages;
      nextButton.addEventListener("click", () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderPage();
          this.renderPagination();
        }
      });
      paginationContainer.appendChild(nextButton);
    }
  }
}

export default SubjectsContainer;
