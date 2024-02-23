import pool from '@utils/database';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { Email } = req.body;
        if (!Email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }
        try {
            const [result] = await pool.query('DELETE FROM Clienti WHERE Email = ?', [Email]);

            if (result.affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Account deleted successfully.' });
            } else {
                res.status(404).json({ success: false, message: 'Account not found.' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
