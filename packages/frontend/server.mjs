//сервер который будет отдавать файлы из dist


import express from 'express'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(express.static(path.join(__dirname, 'dist')));


app.listen(3000, () => console.log('Example app listening on port 3000!'))