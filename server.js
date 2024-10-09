import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { handleContactForm } from './contactForm.js'; 
import { handleRegistrationForm } from './registrationForm.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.post('/contact-form', handleContactForm); 
app.post('/registration-form', handleRegistrationForm); 

app.get('/', function(req, resp){
    resp.json('Hello Node!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
