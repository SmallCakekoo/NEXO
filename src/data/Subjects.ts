// Importar los datos usando require para evitar problemas con la resolución JSON
// @ts-ignore
const subjectsJson = require('./subjects.json');

export interface Subject {
    name: string;
    career: string;
    credits: string;
    image: string;
}

export const subjectsData = subjectsJson; 