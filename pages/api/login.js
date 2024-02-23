'use client';
import pool from '@utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { Email, Parola } = req.body;

            const [rows] = await pool.query('SELECT * FROM Clienti WHERE Email = ?', [Email]);

            const user = rows[0];
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            if (Parola !== user.Parola) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const { password: userPassword, ...restOfUser } = user;
            res.status(200).json({ success: true, message: 'Login successful', user: restOfUser });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message, user: user });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
