import teachersJson from "../../data/teachers.json";

export interface Teacher {
  name: string;
  subject: string;
  nucleus: string;
  rating: string;
  image: string;
}

class TeachersContainer extends HTMLElement {
  private currentPage: number = 1;
  private itemsPerPage: number = 8;
  private teachers: Teacher[] = [];

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
      this.teachers = teachersJson.teachers;
      this.renderPage();
      this.renderPagination();
    } catch (error) {
      console.error("Error loading teachers:", error);
    }
  }

  renderPage() {
    const row = this.shadowRoot?.querySelector(".row");
    if (row) {
      // Clear existing content
      row.innerHTML = "";

      // Calculate pagination
      const totalPages = Math.ceil(this.teachers.length / this.itemsPerPage);
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = Math.min(startIndex + this.itemsPerPage, this.teachers.length);

      // Render only current page items
      for (let i = startIndex; i < endIndex; i++) {
        const teacher = this.teachers[i];
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
  }

  renderPagination() {
    const paginationContainer = this.shadowRoot?.querySelector(".pagination");
    if (paginationContainer) {
      // Clear existing content
      paginationContainer.innerHTML = "";

      const totalPages = Math.ceil(this.teachers.length / this.itemsPerPage);

      // Previous button
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

      // Page numbers
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

      // Next button
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
            <link rel="stylesheet" href="/styles/components/academics/TeachersContainer.css">
            <div class="container">
                <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
                </div>
                <div class="pagination"></div>
            </div>
        `;
  }
}

export default TeachersContainer;
