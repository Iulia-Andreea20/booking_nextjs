import pool from '@utils/database';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { IdReservation } = req.body;
        if (!IdReservation) {
            return res.status(400).json({ success: false, message: 'IdReservation is required.' });
        }
        try {
            const [result] = await pool.query('DELETE FROM Rezervari WHERE IdRezervari = ?', [IdReservation]);

            if (result.affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Reservation deleted successfully.' });
            } else {
                res.status(404).json({ success: false, message: 'IdReservation not found.' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
