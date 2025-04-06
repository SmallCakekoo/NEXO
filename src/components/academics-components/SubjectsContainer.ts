import subjectsJson from "../../data/subjects.json";

export interface Subject {
  name: string;
  career: string;
  credits: string;
  image: string;
  rating: string;
}

class SubjectsContainer extends HTMLElement {
  private currentPage: number = 1;
  private itemsPerPage: number = 8;
  private subjects: Subject[] = [];

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
            <link rel="stylesheet" href="/styles/components/academics/SubjectsContainer.css">
            <div class="container">
                <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
                </div>
                <div class="pagination"></div>
            </div>
        `;
  }

  loadSubjects() {
    try {
      this.subjects = subjectsJson.subjects;
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

      const totalPages = Math.ceil(this.subjects.length / this.itemsPerPage);
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = Math.min(startIndex + this.itemsPerPage, this.subjects.length);

      for (let i = startIndex; i < endIndex; i++) {
        const subject = this.subjects[i];
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
