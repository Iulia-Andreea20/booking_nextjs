import pool from '@utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const reservationData = req.body;

        try {
            await pool.query(
                'INSERT INTO Rezervari (IdClient, IdUnitatiCazare, DataInceputCazare, DataSfarsitCazare, StatusPlata, IdCamera) VALUES (?, ?, ?, ?, ?, ?)',
                [reservationData.IDClient, reservationData.IDUnitateCazare, reservationData.startDate, reservationData.endDate, 'Active', reservationData.IDCamera]
            );

            res.status(200).json({ success: true, message: 'Reservation inserted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error inserting reservation' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
