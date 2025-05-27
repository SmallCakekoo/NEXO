class SignUpFormFields extends HTMLElement {
  private degree: string = '';
  private semester: string = '';
  private formValues: { [key: string]: string } = {};

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
          width: 16.5625rem; 
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
          width: 16.5625rem;
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
        <input type="text" placeholder="Username" name="username" value="${this.formValues.username || ''}" />
        <input type="email" placeholder="Email" name="email" value="${this.formValues.email || ''}" />
        <input type="tel" placeholder="Phone number" name="phone" value="${this.formValues.phone || ''}" />
        <input type="password" placeholder="Password" name="password" value="${this.formValues.password || ''}" />

        <select id="career">
          <option ${this.degree === '' ? 'selected' : ''}>Select a career</option>
          <option ${this.degree === 'Business Administration with an Emphasis in International Business' ? 'selected' : ''}>Business Administration with an Emphasis in International Business</option>
          <option ${this.degree === 'Anthropology' ? 'selected' : ''}>Anthropology</option>
          <option ${this.degree === 'Biology' ? 'selected' : ''}>Biology</option>
          <option ${this.degree === 'Political Science with an Emphasis in International Relations' ? 'selected' : ''}>Political Science with an Emphasis in International Relations</option>
          <option ${this.degree === 'Communication with a Digital Approach' ? 'selected' : ''}>Communication with a Digital Approach</option>
          <option ${this.degree === 'Public Accounting and International Finance' ? 'selected' : ''}>Public Accounting and International Finance</option>
          <option ${this.degree === 'Law' ? 'selected' : ''}>Law</option>
          <option ${this.degree === 'Interactive Media Design' ? 'selected' : ''}>Interactive Media Design</option>
          <option ${this.degree === 'Industrial Design' ? 'selected' : ''}>Industrial Design</option>
          <option ${this.degree === 'Economics' ? 'selected' : ''}>Economics</option>
          <option ${this.degree === 'Economics and International Business' ? 'selected' : ''}>Economics and International Business</option>
          <option ${this.degree === 'Finance' ? 'selected' : ''}>Finance</option>
          <option ${this.degree === 'Biochemical Engineering' ? 'selected' : ''}>Biochemical Engineering</option>
          <option ${this.degree === 'Systems Engineering' ? 'selected' : ''}>Systems Engineering</option>
          <option ${this.degree === 'Industrial Engineering' ? 'selected' : ''}>Industrial Engineering</option>
          <option ${this.degree === 'Telematics Engineering' ? 'selected' : ''}>Telematics Engineering</option>
          <option ${this.degree === "Bachelor's Degree in Social Sciences" ? 'selected' : ''}>Bachelor's Degree in Social Sciences</option>
          <option ${this.degree === "Bachelor's Degree in Foreign Languages with an Emphasis in English" ? 'selected' : ''}>Bachelor's Degree in Foreign Languages with an Emphasis in English</option>
          <option ${this.degree === 'Medicine' ? 'selected' : ''}>Medicine</option>
          <option ${this.degree === 'Music' ? 'selected' : ''}>Music</option>
          <option ${this.degree === 'International Marketing and Advertising' ? 'selected' : ''}>International Marketing and Advertising</option>
          <option ${this.degree === 'Psychology' ? 'selected' : ''}>Psychology</option>
          <option ${this.degree === 'Chemistry' ? 'selected' : ''}>Chemistry</option>
          <option ${this.degree === 'Pharmaceutical Chemistry' ? 'selected' : ''}>Pharmaceutical Chemistry</option>
          <option ${this.degree === 'Sociology' ? 'selected' : ''}>Sociology</option>
        </select>

        <select id="semester">
          <option disabled selected>Semester</option>
          <option ${this.semester === '' ? 'selected' : ''}>Select a semester</option>
          <option ${this.semester === 'First semester' ? 'selected' : ''}>First semester</option>
          <option ${this.semester === 'Second semester' ? 'selected' : ''}>Second semester</option>
          <option ${this.semester === 'Third semester' ? 'selected' : ''}>Third semester</option>
          <option ${this.semester === 'Fourth semester' ? 'selected' : ''}>Fourth semester</option>
          <option ${this.semester === 'Fifth semester' ? 'selected' : ''}>Fifth semester</option>
          <option ${this.semester === 'Sixth semester' ? 'selected' : ''}>Sixth semester</option>
          <option ${this.semester === 'Seventh semester' ? 'selected' : ''}>Seventh semester</option>
          <option ${this.semester === 'Eighth semester' ? 'selected' : ''}>Eighth semester</option>
          <option ${this.semester === 'Ninth semester' ? 'selected' : ''}>Ninth semester</option>
          <option ${this.semester === 'Tenth semester' ? 'selected' : ''}>Tenth semester</option>
          <option ${this.semester === '+Tenth semester' ? 'selected' : ''}>+Tenth semester</option>
        </select>
      </form>
    `;
  }

  setupEventListeners() {
    const form = this.querySelector('#signup-form') as HTMLFormElement;
    if (form) {
      // Store initial values
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => {
        this.formValues[input.name] = input.value;
      });

      // Add input event listeners to store values
      inputs.forEach(input => {
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          this.formValues[target.name] = target.value;
        });
      });

      // Add event listeners for degree and semester selects
      const degreeSelect = this.querySelector('#career') as HTMLSelectElement;
      const semesterSelect = this.querySelector('#semester') as HTMLSelectElement;
      
      if (degreeSelect) {
        degreeSelect.addEventListener("change", (e) => {
          const target = e.target as HTMLSelectElement;
          this.degree = target.value;
          target.style.color = "black";
          this.dispatchEvent(new CustomEvent('degree-changed', { detail: this.degree }));
        });
      }

      if (semesterSelect) {
        semesterSelect.addEventListener("change", (e) => {
          const target = e.target as HTMLSelectElement;
          this.semester = target.value;
          target.style.color = "black";
          this.dispatchEvent(new CustomEvent('semester-changed', { detail: this.semester }));
        });
      }
    }
  }

  // Method to store current form values
  storeFormValues() {
    const form = this.querySelector('#signup-form') as HTMLFormElement;
    if (form) {
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => {
        this.formValues[input.name] = input.value;
      });

      // Store select values
      const degreeSelect = this.querySelector('#career') as HTMLSelectElement;
      const semesterSelect = this.querySelector('#semester') as HTMLSelectElement;
      
      if (degreeSelect) {
        this.degree = degreeSelect.value;
      }
      if (semesterSelect) {
        this.semester = semesterSelect.value;
      }
    }
  }

  // Method to restore form values
  restoreFormValues() {
    const form = this.querySelector('#signup-form') as HTMLFormElement;
    if (form) {
      // Restore input values
      Object.entries(this.formValues).forEach(([name, value]) => {
        const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
        if (input) {
          input.value = value;
        }
      });

      // Restore select values
      const degreeSelect = this.querySelector('#career') as HTMLSelectElement;
      const semesterSelect = this.querySelector('#semester') as HTMLSelectElement;
      
      if (degreeSelect && this.degree) {
        degreeSelect.value = this.degree;
        degreeSelect.style.color = "black";
      }
      if (semesterSelect && this.semester) {
        semesterSelect.value = this.semester;
        semesterSelect.style.color = "black";
      }
    }
  }

  // Add getters to access the current values
  getDegree(): string {
    return this.degree;
  }

  getSemester(): string {
    return this.semester;
  }

  // Method to check if both degree and semester selects have been filled
  areSelectsFilled(): boolean {
    return this.degree !== '' && this.degree !== 'Select a career' &&
           this.semester !== '' && this.semester !== 'Select a semester';
  }
}

customElements.define('signup-form-fields', SignUpFormFields);

export default SignUpFormFields;

