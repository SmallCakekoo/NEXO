class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <style>
                .search-container {
                    position: relative;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .search-input {
                    width: 100%;
                    padding: 12px 20px;
                    padding-left: 45px;
                    font-size: 1rem;
                    border: 2px solid #e9ecef;
                    border-radius: 50px;
                    outline: none;
                    transition: all 0.3s ease;
                    background-color: white;
                    color: #2d3748;
                }

                .search-input:focus {
                    border-color: #5354ED;
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
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-line="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                    class="search-input" 
                    placeholder="Search teachers, subjects..."
                    id="search-input"
                    name="search-input"
                >
            </div>
        `;
    }
}

export default SearchBar; 