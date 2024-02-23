import pool from '@utils/database';

export default async function handler(req, res) {
    const { IDCamera } = req.query;

    if (!IDCamera || typeof IDCamera !== 'string') {
        return res.status(400).json({ message: 'IDCamera is required' });
    }

    try {
        const query = `
        SELECT
            R.DataInceputCazare,
            R.DataSfarsitCazare,
            U.NumeUnitatiCazare,
            U.Locatie,
            U.DescriereUnitatiCazare,
            C.NumarPaturi,
            C.Pret,
            C.TipImobil
        FROM
            Rezervari R
        INNER JOIN UnitatiCazare U ON
            R.IdUnitatiCazare = U.IDUnitatiCazare
        INNER JOIN Camere C ON
            R.IdCamera = C.IDCamera
        WHERE
            R.IdCamera = ? AND R.StatusPlata IN('Active', 'Completed');
`;
        const [reservations] = await pool.query(query, [IDCamera]);

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Database query error', error);
        res.status(500).json({ message: 'Error fetching reservations' });
    }
}