import { validateFields } from './validation.js';
import nodemailer from 'nodemailer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleContactForm = async (req, res) => {
    const { name, email, phone, subject, comment } = req.body;

    const rules = {
        name: ['required'],
        email: ['required', 'email'],
        phone: ['required', 'mobile'],
        subject: ['required'],
    };

    const { isValid, errors } = validateFields({ name, email, phone, subject }, rules);

    if (!isValid) {
        return res.json({ status: 0, code: 401, message: errors });
    }

    function formatName(name) {
        return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const htmlAdmin = `
        <html>
            <body>
                <h4>Hi,</h4>
                <h4>You have a new contact form submission.</h4>
                <ul style="list-style-type: disc; padding-left: 20px;">
                    <li>Full Name: ${name}</li>
                    <li>Email: ${email}</li>
                    <li>Phone: ${phone}</li>
                    <li>Subject: ${subject}</li>
                    <li>Comment: ${comment}</li>
                </ul>
            </body>
        </html>
    `;

    const htmlFilePath = path.join(__dirname, 'emailer.html');
    let htmlUser = await fs.readFile(htmlFilePath, 'utf8');
    htmlUser = htmlUser.replace('{full_name}', formatName(name));
    
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptionsAdmin = {
        from: '"IPFYuva" <registration@ipfyuva.com>',
        to: '"IPFYuva" <registration@ipfyuva.com>',
        subject: `New Contact Form Details: ${formatName(name)}`,
        html: htmlAdmin,
    };
    const mailOptionsUser = {
        from: '"IPFYuva" <registration@ipfyuva.com>',
        to: email,
        subject: `Thank You for Reaching Out!`,
        html: htmlUser,
    };

    try {
        await transporter.sendMail(mailOptionsAdmin); 
        await transporter.sendMail(mailOptionsUser); 
        res.status(200).send('Your details have been submitted successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('There was an error sending your message.');
    }
};
