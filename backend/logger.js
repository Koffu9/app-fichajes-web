import fs from 'fs';
import path from 'path';

const logPath = path.resolve('error.log');

export function logError(origen, error) {
    const fecha = new Date().toISOString();
    const linea = `[${fecha}] [${origen}] ${error.message || error}\n`;
    
    fs.appendFileSync(logPath, linea);
}