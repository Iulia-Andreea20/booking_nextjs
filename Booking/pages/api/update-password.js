import pool from '@Booking/utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { Email, oldPassword, newPassword } = req.body;

        const [users] = await pool.query('SELECT Parola FROM Clienti WHERE Email = ?', [Email]);

        const user = users[0];
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.Parola !== oldPassword) {
            return res.status(401).json({ message: 'Old password is incorrect.' });
        }

        await pool.query('UPDATE Clienti SET Parola = ? WHERE Email = ?', [newPassword, Email]);

        return res.status(200).json({ success: true, message: 'Password successfully updated.' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
