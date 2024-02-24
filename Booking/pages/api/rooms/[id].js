import pool from '@Booking/utils/database';

export default async function handler(req, res) {
    const {
        query: { id, numarCamere, numarPersoane },
    } = req;
    let queryToExecute = '';
    let sqlQuery = '';
    let queryParams = [];
    if (req.method === 'GET') {
        try {
            if (numarCamere == 1) {
                sqlQuery = `
                SELECT
                    U.IDUnitatiCazare,
                    U.NumeUnitatiCazare,
                    U.Locatie,
                    U.DescriereUnitatiCazare,
                    C.IDCamera,
                    C.TipImobil,
                    C.NumarPaturi,
                    C.Pret,
                    (
                    SELECT
                        COUNT(*)
                    FROM
                        Camere C2
                    WHERE
                        C2.IDUnitatiCazare = U.IDUnitatiCazare AND C2.NumarPaturi >= ? AND NOT EXISTS(
                        SELECT
                            1
                        FROM
                            Rezervari R
                        WHERE
                            R.IDCamera = C2.IDCamera AND R.StatusPlata IN('Cancelled')
                    )
                ) AS CamereCuNumarPaturiSuficient,
                (
                    SELECT
                        COUNT(*)
                    FROM
                        Camere C3
                    WHERE
                        C3.IDUnitatiCazare = U.IDUnitatiCazare
                ) AS TotalCamere,
                CASE WHEN(
                    SELECT
                        COUNT(*)
                    FROM
                        Camere C4
                    WHERE
                        C4.IDUnitatiCazare = U.IDUnitatiCazare AND C4.NumarPaturi >= ?
                ) < ? THEN 'Not enough rooms available' ELSE 'Sufficient rooms'
                END AS AvailabilityMessage
                FROM
                    UnitatiCazare U
                JOIN Camere C ON
                    U.IDUnitatiCazare = C.IDUnitatiCazare
                WHERE
                    U.IDUnitatiCazare = ? AND C.NumarPaturi >= ?
                GROUP BY
                    U.IDUnitatiCazare,
                    C.IDCamera,
                    C.TipImobil,
                    C.NumarPaturi,
                    C.Pret
                HAVING
                    CamereCuNumarPaturiSuficient > 0
            `;
                queryToExecute = sqlQuery;
                queryParams = [numarPersoane, numarPersoane, numarCamere, id, numarPersoane];

            } else if (numarCamere == 2) {
                sqlQuery = `
                SELECT
                    C1.IDCamera AS Room1ID,
                    C1.TipImobil AS Room1Type,
                    C1.NumarPaturi AS Room1Beds,
                    C1.Pret AS Room1Price,
                    C2.IDCamera AS Room2ID,
                    C2.TipImobil AS Room2Type,
                    C2.NumarPaturi AS Room2Beds,
                    C2.Pret AS Room2Price,
                    C1.NumarPaturi + C2.NumarPaturi AS TotalBeds,
                    C1.Pret + C2.Pret AS TotalPrice
                FROM
                    Camere AS C1
                JOIN Camere AS C2
                ON
                    C1.IDCamera < C2.IDCamera AND C1.IDUnitatiCazare = C2.IDUnitatiCazare
                WHERE
                    C1.IDUnitatiCazare = ? AND C1.NumarPaturi + C2.NumarPaturi = ? AND NOT EXISTS(
                    SELECT
                        1
                    FROM
                        Rezervari R1
                    WHERE
                        R1.IDCamera = C1.IDCamera AND R1.StatusPlata = 'Cancelled'
                ) AND NOT EXISTS(
                    SELECT
                        1
                    FROM
                        Rezervari R2
                    WHERE
                        R2.IDCamera = C2.IDCamera AND R2.StatusPlata = 'Cancelled'
            )`;
                queryToExecute = sqlQuery;
                queryParams = [id, numarPersoane];
            }
            console.log('Executing query with params:', queryParams);
            const [rows] = await pool.query(queryToExecute, queryParams);
            res.status(200).json(rows);

        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}