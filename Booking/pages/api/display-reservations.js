import pool from '@Booking/utils/database';

export default async function handler(req, res) {
    const { IdClient } = req.query;

    if (!IdClient) {
        return res.status(400).json({ message: 'IdClient is required' });
    }

    try {
        const query = `
        SELECT
            R.IdRezervari,
            R.IdClient,
            R.IdCamera,
            U.NumeUnitatiCazare,
            U.Locatie,
            U.Check_in,
            U.Check_out,
            C.Pret,
            R.DataInceputCazare,
            R.DataSfarsitCazare,
            R.StatusPlata,
            DATEDIFF(
                R.DataSfarsitCazare,
                R.DataInceputCazare
            ) * C.Pret AS PretSejur,
            F.ExperientaCazare AS Feedback,
            F.Rating AS Rating
        FROM
            Rezervari R
        INNER JOIN UnitatiCazare U ON
            R.IdUnitatiCazare = U.IDUnitatiCazare
        INNER JOIN Camere C ON
            R.IdCamera = C.IDCamera
        LEFT JOIN FeedbackClienti F ON
            R.IdRezervari = F.IdRezervari
        WHERE
            R.IdClient = ?;
    `;

        const [rows] = await pool.query(query, [IdClient]);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Database query error', error);
        res.status(500).json({ message: 'Error fetching reservations' });
    }
}