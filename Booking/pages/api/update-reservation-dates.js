import pool from '@Booking/utils/database'
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { IdRezervari, DataInceputCazare, DataSfarsitCazare } = req.body;

        try {
            const result = await pool.query('UPDATE Rezervari SET DataInceputCazare = ?, DataSfarsitCazare = ? WHERE IdRezervari = ?',
                [DataInceputCazare, DataSfarsitCazare, IdRezervari]);

            console.log(result);

            return res.status(200).json({ success: true, message: 'Reservation dates updated successfully.' });

        } catch (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
