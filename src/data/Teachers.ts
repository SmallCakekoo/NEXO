// Importar los datos usando require para evitar problemas con la resolución JSON
// @ts-ignore
const teachersJson = require('./teachers.json');

export interface Teacher {
    name: string;
    subject: string;
    nucleus: string;
    rating: string;
    image: string;
}

export const teachersData = teachersJson; 