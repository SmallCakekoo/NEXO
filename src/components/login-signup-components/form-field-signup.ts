class SignUpFormFields extends HTMLElement {
  private degree: string = "";
  private semester: string = "";

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <style>
        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-color: white;
          background-image: url("data:image/svg+xml,%3Csvg fill='%234F46E5' height='0.75rem' viewBox='0 0 24 24' width='0.75rem' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.4375rem center; 
          background-size: 2.0625rem; 
          color: rgb(167, 167, 167);
          width: 24rem;
          padding: 0.3125rem 1rem; 
          margin-bottom: 1.4375rem; 
          border: 0.125rem solid #5354ED; 
          border-radius: 1.875rem; 
          outline: none;
          font-size: 0.875rem; 
          font-family: Roboto, sans-serif;
          transition: border-color 0.3s ease;
          cursor: pointer;
        }

        select:focus {
          background-image: url("data:image/svg+xml,%3Csvg fill='%23BD02FF' height='1rem' viewBox='0 0 24 24' width='1rem' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          border-color: #BD02FF;
          color: black;
        }

        input {
          width: 22rem;
          padding: 0.3125rem 1rem;
          margin-bottom: 1.4375rem;
          border: 0.125rem solid #5354ED;
          border-radius: 1.875rem;
          outline: none;
          font-size: 0.875rem;
          font-family: Roboto, sans-serif;
          transition: border-color 0.3s ease;
          cursor: pointer;
          color: black;
        }

        input:focus,
        select:focus {
          border-color: #BD02FF;
        }

        @media (max-width: 430px) {
          input,
          select {
            width: 100%;
            font-size: 0.8125rem;
            padding: 0.3125rem 0.75rem;
          }
        }
      </style>

      <form id="signup-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
        <input type="text" placeholder="Username" name="username" />
        <input type="email" placeholder="Email" name="email" />
        <input type="tel" placeholder="Phone number" name="phone" />
        <input type="password" placeholder="Password" name="password" />

        <select id="career">
          <option value="">Select a career</option>
          <option value="Business Administration with an Emphasis in International Business">Business Administration with an Emphasis in International Business</option>
          <option value="Anthropology">Anthropology</option>
          <option value="Biology">Biology</option>
          <option value="Political Science with an Emphasis in International Relations">Political Science with an Emphasis in International Relations</option>
          <option value="Communication with a Digital Approach">Communication with a Digital Approach</option>
          <option value="Public Accounting and International Finance">Public Accounting and International Finance</option>
          <option value="Law">Law</option>
          <option value="Interactive Media Design">Interactive Media Design</option>
          <option value="Industrial Design">Industrial Design</option>
          <option value="Economics">Economics</option>
          <option value="Economics and International Business">Economics and International Business</option>
          <option value="Finance">Finance</option>
          <option value="Biochemical Engineering">Biochemical Engineering</option>
          <option value="Systems Engineering">Systems Engineering</option>
          <option value="Industrial Engineering">Industrial Engineering</option>
          <option value="Telematics Engineering">Telematics Engineering</option>
          <option value="Bachelor's Degree in Social Sciences">Bachelor's Degree in Social Sciences</option>
          <option value="Bachelor's Degree in Foreign Languages with an Emphasis in English">Bachelor's Degree in Foreign Languages with an Emphasis in English</option>
          <option value="Medicine">Medicine</option>
          <option value="Music">Music</option>
          <option value="International Marketing and Advertising">International Marketing and Advertising</option>
          <option value="Psychology">Psychology</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Pharmaceutical Chemistry">Pharmaceutical Chemistry</option>
          <option value="Sociology">Sociology</option>
        </select>

        <select id="semester">
          <option value="">Select a semester</option>
          <option value="First semester">First semester</option>
          <option value="Second semester">Second semester</option>
          <option value="Third semester">Third semester</option>
          <option value="Fourth semester">Fourth semester</option>
          <option value="Fifth semester">Fifth semester</option>
          <option value="Sixth semester">Sixth semester</option>
          <option value="Seventh semester">Seventh semester</option>
          <option value="Eighth semester">Eighth semester</option>
          <option value="Ninth semester">Ninth semester</option>
          <option value="Tenth semester">Tenth semester</option>
          <option value="+Tenth semester">+Tenth semester</option>
        </select>
      </form>
    `;
  }

  setupEventListeners() {
    const degreeSelect = this.querySelector("#career") as HTMLSelectElement;
    const semesterSelect = this.querySelector("#semester") as HTMLSelectElement;

    if (degreeSelect) {
      degreeSelect.addEventListener("change", (e) => {
        const target = e.target as HTMLSelectElement;
        this.degree = target.value;
        target.style.color = "black";
      });
    }

    if (semesterSelect) {
      semesterSelect.addEventListener("change", (e) => {
        const target = e.target as HTMLSelectElement;
        this.semester = target.value;
        target.style.color = "black";
      });
    }
  }

  getDegree(): string {
    const select = this.querySelector("#career") as HTMLSelectElement;
    return select ? select.value : "";
  }

  getSemester(): string {
    const select = this.querySelector("#semester") as HTMLSelectElement;
    return select ? select.value : "";
  }
}

customElements.define("signup-form-fields", SignUpFormFields);

export default SignUpFormFields;
