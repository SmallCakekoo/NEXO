class SignUpFormFields extends HTMLElement {
  connectedCallback() {
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
        <input type="text" placeholder="Username" name="username" />
        <input type="email" placeholder="Email" name="email" />
        <input type="tel" placeholder="Phone number" name="phone" />
        <input type="password" placeholder="Password" name="password" />

        <select name="degree">
          <option disabled selected>Degree</option>
          <option>Administración de Empresas con Énfasis en Negocios Internacionales</option>
          <option>Antropología</option>
          <option>Bacteriología y Laboratorio Clínico</option>
          <option>Biología</option>
          <option>Ciencia Política</option>
          <option>Comunicación con Enfoque Digital</option>
          <option>Contaduría Pública y Finanzas Internacionales</option>
          <option>Derecho</option>
          <option>Diseño de Medios Interactivos</option>
          <option>Diseño Industrial (Diseño + Innovación)</option>
          <option>Economía y Negocios Internacionales</option>
          <option>Finanzas con Énfasis en Mercados Globales</option>
          <option>Ingeniería Bioquímica</option>
          <option>Ingeniería de Sistemas</option>
          <option>Ingeniería en Energía Inteligente</option>
          <option>Ingeniería Industrial</option>
          <option>Licenciatura en Ciencias Sociales</option>
          <option>Licenciatura en Lenguas Extranjeras con Énfasis en Inglés</option>
          <option>Medicina</option>
          <option>Mercadeo Internacional y Publicidad</option>
          <option>Música</option>
          <option>Negocios, Estrategia y Tecnología</option>
          <option>Psicología</option>
          <option>Química</option>
          <option>Química Farmacéutica</option>
          <option>Sociología</option>
          <option>Veterinaria y Zootecnia</option>
        </select>

        <select name="semester">
          <option disabled selected>Semester</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
          <option>+10</option>
        </select>
      </form>
    `;

    const degreeSelect = this.querySelector('select[name="degree"]') as HTMLSelectElement;
    const semesterSelect = this.querySelector('select[name="semester"]') as HTMLSelectElement;
    
    if (degreeSelect) {
      degreeSelect.addEventListener("change", () => {
        degreeSelect.style.color = "black"; 
      });
    }

    if (semesterSelect) {
      semesterSelect.addEventListener("change", () => {
        semesterSelect.style.color = "black"; 
      });
    }
  }
}

customElements.define('signup-form-fields', SignUpFormFields);

export default SignUpFormFields;

