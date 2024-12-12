const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/send-spreadsheet', upload.single('file'), async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tu.correo@gmail.com',
                pass: 'tu_contraseña',
            },
        });

        const mailOptions = {
            from: 'tu.correo@gmail.com',
            to: 'gladys.alfonsina.ochoa@upc.edu, kalyani.mohanty@upc.edu',
            subject: 'Resumen de Reservas - XRF',
            text: 'Adjunto encontrarás la hoja de cálculo con el resumen de las reservas.',
            attachments: [
                {
                    filename: 'reservas.xlsx',
                    path: req.file.path,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        fs.unlinkSync(req.file.path);
        res.json({ message: 'Hoja de cálculo enviada exitosamente.' });
    } catch (error) {
        console.error('Error enviando el correo:', error);
        res.status(500).json({ error: 'Error enviando el correo.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
