import { teachers } from "../../types/academics/TeachersContainer.types";
import { fetchTeachers } from "../../services/TeacherService";
import { store, State } from "../../flux/Store";
import { SearchActions } from "../../flux/SearchActions";

class TeachersContainer extends HTMLElement {
  private currentPage: number = 1;
  private itemsPerPage: number = 8;
  private teachers: teachers[] = [];
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.loadTeachers();
    this.unsubscribeStore = store.subscribe(() => {
      this.renderPage();
      this.renderPagination();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  async loadTeachers() {
    try {
      const response = await fetchTeachers();
      this.teachers = response.teachers;
      this.renderPage();
      this.renderPagination();
    } catch (error) {
      console.error("Error loading teachers:", error);
    }
  }
  renderPage() {
    const row = this.shadowRoot?.querySelector(".row");
    if (!row) return;

    row.innerHTML = "";

    const state = store.getState();
    const teacherList = state.filteredTeachers ? state.filteredTeachers : this.teachers;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, teacherList.length);

    for (let i = startIndex; i < endIndex; i++) {
      const teacher = teacherList[i] as teachers;

      const col = document.createElement("div");
      col.className = "col";

      const card = document.createElement("teacher-card");
      card.setAttribute("name", teacher.name);
      card.setAttribute("subject", teacher.subject);
      card.setAttribute("nucleus", teacher.nucleus);
      card.setAttribute("rating", teacher.rating);
      card.setAttribute("image", teacher.image);

      col.appendChild(card);
      row.appendChild(col);
    }
  }

  renderPagination() {
    const paginationContainer = this.shadowRoot?.querySelector(".pagination");
    if (paginationContainer) {
      paginationContainer.innerHTML = "";

      const state = store.getState();
      const teacherList = state.filteredTeachers ? state.filteredTeachers : this.teachers;
      
      const totalPages = Math.ceil(teacherList.length / this.itemsPerPage);

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
          background-color: var(--nexowhite);
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
          color: var(--nexowhite);
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
}

export default TeachersContainer;
