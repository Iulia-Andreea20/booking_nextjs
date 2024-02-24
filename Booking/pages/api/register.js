import pool from '@Booking/utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { Nume, Prenume, NumarTelefon, Email, Parola } = req.body;

        try {
            await pool.query(
                'INSERT INTO Clienti (Nume, Prenume, NumarTelefon, Email, Parola) VALUES (?, ?, ?, ?, ?)',
                [Nume, Prenume, NumarTelefon, Email, Parola]
            );

            res.status(200).json({ success: true, message: 'User inserted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error inserting user' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
