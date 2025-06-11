import { SearchActions, SearchActionTypes } from "../../flux/SearchActions";
import { fetchTeachers } from "../../services/TeacherService";
import { SearchBarAttributes } from "../../types/academics/Searchbar.type";
import { fetchSubjects } from "../../services/SubjectService";
import { teachers } from "../../types/academics/TeachersContainer.types";
import { store, State } from "../../flux/Store";

class SearchBar extends HTMLElement {
  private searchInput: HTMLInputElement | null = null;
  searchtype: string;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.searchtype = "";
  }

  static get observedAttributes(): (keyof SearchBarAttributes)[] {
    return ["searchtype"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.searchtype = newValue;
  }

  private setupEventListeners() {
    this.searchInput = this.shadowRoot?.querySelector("#search-input") as HTMLInputElement;

    if (this.searchInput) {
      this.searchInput.addEventListener("input", async (e) => {

        e.preventDefault();
        console.log(this.searchtype);

        let result;

        switch (this.searchtype) {
          case "teacher":
            const teachers = await fetchTeachers();
            result = teachers.teachers.filter((teacher) => {
              const lowerName = teacher.name.toLocaleLowerCase();
              return lowerName.includes(this.searchInput!.value.toLowerCase());
            });

            if (this.searchInput?.value.length === 0) {
              result = teachers.teachers;
            }

            SearchActions.searchTeachers(this.searchInput!.value);
            break;
          case "subjects":
            const subjects = await fetchSubjects();
            result = subjects.subjects.filter((subject) => {
              const lowerName = subject.name.toLocaleLowerCase();
              return lowerName.includes(this.searchInput!.value.toLowerCase());
            });

            if (this.searchInput?.value.length === 0) {
              result = subjects.subjects;
            }

            SearchActions.searchSubjects(this.searchInput!.value);
            break;
          default:
            break;
        }

        // SearchActions.searchQuery(result!);
        console.log(store.getState());
      });
      // this.searchInput.addEventListener('input', this.handleSearch.bind(this));
      // this.searchInput.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  // private handleKeydown(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();

  //   }
  // }

  // private handleSearch() {
  //   if (!this.searchInput) return;

  //   const query = this.searchInput.value.trim();

  //   if (query === '') {
  //     SearchActions.clearSearch();
  //     return;
  //   }

  //   SearchActions.searchAll(query);
  // }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .search-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px;
          padding-left: 50px;
          font-size: 1rem;
          border: 2px solid var(--nexolightwhite);
          border-radius: 50px;
          outline: none;
          background-color: white;
          color: #2d3748;
          box-sizing: border-box;
        }

        @media (max-width: 576px) {
          .search-input {
            font-size: 0.9rem;
            padding: 10px 20px;
            padding-left: 50px;
          }

          .search-icon {
            width: 18px;
            height: 18px;
          }
        }

        .search-input:focus {
          border-color: var(--nexopurple);
          box-shadow: 0 0 0 3px rgba(83, 84, 237, 0.1);
        }

        .search-input::placeholder {
          color: #a0aec0;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          pointer-events: none;
        }
      </style>

      <div class="search-container">
        <svg
          class="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          class="search-input"
          placeholder="Search teachers, subjects..."
          id="search-input"
          name="search-input"
        />
      </div>
    `;
  }
}

export default SearchBar;
