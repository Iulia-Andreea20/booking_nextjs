import pool from '@utils/database';

export default async function handler(req, res) {
    const { searchTerm, selectedRating } = req.query;

    console.log('Existing query params:', searchTerm, selectedRating);

    let queryParams = [];
    let querryToExecute = '';
    if (selectedRating) {
        queryParams.push(selectedRating);

        let ratingQuery = `
        SELECT
            U.IDUnitatiCazare,
            U.NumeUnitatiCazare,
            U.Locatie,
            U.DescriereUnitatiCazare,
            COALESCE(AvgRating.AverageRating, 0) AS AverageRating,
            COALESCE(MinPrice.StartingPrice, 0) AS StartingPrice,
            COALESCE(FacCount.NumberOfFacilities, 0) AS NumberOfFacilities,
            RoomInfo.CamereInfo,
            FacilityInfo.FacilitatiDescriere
        FROM
            UnitatiCazare U
        INNER JOIN(
            SELECT R.IdUnitatiCazare,
                AVG(F.Rating) AS AverageRating
            FROM
                Rezervari R
            INNER JOIN FeedbackClienti F ON
                R.IdRezervari = F.IdRezervari
            GROUP BY
                R.IdUnitatiCazare
            HAVING
                AVG(F.Rating) >= ?
        ) AvgRating
        ON
            U.IDUnitatiCazare = AvgRating.IdUnitatiCazare
        LEFT JOIN(
            SELECT C.IDUnitatiCazare,
                MIN(C.Pret) AS StartingPrice
            FROM
                Camere C
            GROUP BY
                C.IDUnitatiCazare
        ) MinPrice
        ON
            U.IDUnitatiCazare = MinPrice.IDUnitatiCazare
        LEFT JOIN(
            SELECT C.IDUnitatiCazare,
                COUNT(DISTINCT FC.IDFacilitati) AS NumberOfFacilities
            FROM
                Camere C
            INNER JOIN FacilitatiCamere FC ON
                C.IDCamera = FC.IDCamera
            GROUP BY
                C.IDUnitatiCazare
        ) FacCount
        ON
            U.IDUnitatiCazare = FacCount.IDUnitatiCazare
        LEFT JOIN(
            SELECT C.IDUnitatiCazare,
                GROUP_CONCAT(
                    DISTINCT CONCAT_WS(':', C.IDCamera, C.Pret)
                ORDER BY
                    C.Pret ASC SEPARATOR '; '
                ) AS CamereInfo
            FROM
                Camere C
            GROUP BY
                C.IDUnitatiCazare
        ) RoomInfo
        ON
            U.IDUnitatiCazare = RoomInfo.IDUnitatiCazare
        LEFT JOIN(
            SELECT C.IDUnitatiCazare,
                GROUP_CONCAT(
                    DISTINCT FL.Descriere
                ORDER BY
                    FL.Descriere SEPARATOR ', '
                ) AS FacilitatiDescriere
            FROM
                Camere C
            INNER JOIN FacilitatiCamere FC ON
                C.IDCamera = FC.IDCamera
            INNER JOIN Facilitati FL ON
                FC.IDFacilitati = FL.IdFacilitate
            GROUP BY
                C.IDUnitatiCazare
        ) FacilityInfo
        ON
            U.IDUnitatiCazare = FacilityInfo.IDUnitatiCazare
        `

        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
            let whereClause = "WHERE U.NumeUnitatiCazare LIKE ?";
            ratingQuery += whereClause;
        }
        querryToExecute = ratingQuery;
    }
    else if (searchTerm) {
        queryParams.push(`%${searchTerm}%`);
        let searchQuery = `
        SELECT
            U.IDUnitatiCazare,
            U.NumeUnitatiCazare,
            U.Locatie,
            U.DescriereUnitatiCazare,
            COALESCE(AvgRating.AverageRating, 0) AS AverageRating,
            COALESCE(MinPrice.StartingPrice, 0) AS StartingPrice,
            COALESCE(FacCount.NumberOfFacilities, 0) AS NumberOfFacilities,
            RoomInfo.CamereInfo,
            FacilityInfo.FacilitatiDescriere
        FROM
            UnitatiCazare U
        LEFT JOIN(
            SELECT
                R.IdUnitatiCazare,
                AVG(F.Rating) AS AverageRating
            FROM
                Rezervari R
            LEFT JOIN FeedbackClienti F ON
                R.IdRezervari = F.IdRezervari
            GROUP BY
                R.IdUnitatiCazare
        ) AvgRating
        ON
            U.IDUnitatiCazare = AvgRating.IdUnitatiCazare
        LEFT JOIN(
            SELECT
                C.IDUnitatiCazare,
                MIN(C.Pret) AS StartingPrice
            FROM
                Camere C
            GROUP BY
                C.IDUnitatiCazare
        ) MinPrice
        ON
            U.IDUnitatiCazare = MinPrice.IDUnitatiCazare
        LEFT JOIN(
            SELECT
                C.IDUnitatiCazare,
                COUNT(DISTINCT FC.IDFacilitati) AS NumberOfFacilities
            FROM
                Camere C
            LEFT JOIN FacilitatiCamere FC ON
                C.IDCamera = FC.IDCamera
            GROUP BY
                C.IDUnitatiCazare
        ) FacCount
        ON
            U.IDUnitatiCazare = FacCount.IDUnitatiCazare
        LEFT JOIN(
            SELECT
                C.IDUnitatiCazare,
                GROUP_CONCAT(
                    DISTINCT CONCAT_WS(':', C.IDCamera, C.Pret)
                ORDER BY
                    C.Pret ASC SEPARATOR '; '
                ) AS CamereInfo
            FROM
                Camere C
            GROUP BY
                C.IDUnitatiCazare
        ) RoomInfo
        ON
            U.IDUnitatiCazare = RoomInfo.IDUnitatiCazare
        LEFT JOIN(
            SELECT
                C.IDUnitatiCazare,
                GROUP_CONCAT(
                    DISTINCT FL.Descriere
                ORDER BY
                    FL.Descriere SEPARATOR ', '
                ) AS FacilitatiDescriere
            FROM
                Camere C
            LEFT JOIN FacilitatiCamere FC ON
                C.IDCamera = FC.IDCamera
            LEFT JOIN Facilitati FL ON
                FC.IDFacilitati = FL.IdFacilitate
            GROUP BY
                C.IDUnitatiCazare
        ) FacilityInfo
        ON
            U.IDUnitatiCazare = FacilityInfo.IDUnitatiCazare
        WHERE
            U.NumeUnitatiCazare LIKE ?
        GROUP BY
            U.IDUnitatiCazare;
            `;

        querryToExecute = searchQuery;
    } else {
        const filterQuery = `
        SELECT
            U.IDUnitatiCazare,
            U.NumeUnitatiCazare,
            U.Locatie,
            U.DescriereUnitatiCazare,
            AVG(F.Rating) AS AverageRating,
            MIN(C.Pret) AS StartingPrice,
            COUNT(DISTINCT FC.IDFacilitati) AS NumberOfFacilities,
            GROUP_CONCAT(
                DISTINCT CONCAT_WS(':', C.IDCamera, C.Pret)
            ORDER BY
                C.Pret ASC SEPARATOR '; '
            ) AS CamereInfo,
            GROUP_CONCAT(
                DISTINCT FL.Descriere
            ORDER BY
                FL.Descriere SEPARATOR ', '
            ) AS FacilitatiDescriere
        FROM
            UnitatiCazare U
        LEFT JOIN Rezervari R ON
            U.IDUnitatiCazare = R.IdUnitatiCazare
        LEFT JOIN FeedbackClienti F ON
            R.IdRezervari = F.IdRezervari
        LEFT JOIN Camere C ON
            U.IDUnitatiCazare = C.IDUnitatiCazare
        LEFT JOIN Facilitaticamere FC ON
            C.IDCamera = FC.IDCamera
        LEFT JOIN Facilitati FL ON
            FC.IDFacilitati = FL.IdFacilitate
        GROUP BY
            U.IDUnitatiCazare
        ORDER BY
            U.NumeUnitatiCazare
        `;
        querryToExecute = filterQuery;
    }

    try {
        const [results] = await pool.query(querryToExecute, queryParams);
        const formattedResults = results.map(result => ({
            ...result,
            AverageRating: result.AverageRating ? parseFloat(result.AverageRating).toFixed(1) : '0', // Formatare rating
            StartingPrice: result.StartingPrice ? parseFloat(result.StartingPrice).toFixed(2) : '0', // Formatare preț
            CamereSiFacilitati: result.CamereSiFacilitati ? result.CamereSiFacilitati.split(';').map(camera => {
                const parts = camera.split(':');
                const idCamera = parts[0];
                const pret = parts[1];
                const facilitati = parts.slice(2).join(':');
                return {
                    idCamera,
                    pret,
                    facilitati: facilitati.split(', ')
                };
            }) : []
        }));
        res.status(200).json(formattedResults);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// SELECT
// U.IDUnitatiCazare,
// U.NumeUnitatiCazare,
// U.Locatie,
// U.DescriereUnitatiCazare,
// COALESCE(AvgRating.AverageRating, 0) AS AverageRating,
// COALESCE(MinPrice.StartingPrice, 0) AS StartingPrice,
// COALESCE(FacCount.NumberOfFacilities, 0) AS NumberOfFacilities,
// RoomInfo.CamereInfo,
// FacilityInfo.FacilitatiDescriere
// FROM
// UnitatiCazare U
// LEFT JOIN(
// SELECT
//     R.IdUnitatiCazare,
//     AVG(F.Rating) AS AverageRating
// FROM
//     Rezervari R
// LEFT JOIN FeedbackClienti F ON
//     R.IdRezervari = F.IdRezervari
// GROUP BY
//     R.IdUnitatiCazare
// ) AvgRating
// ON
// U.IDUnitatiCazare = AvgRating.IdUnitatiCazare
// LEFT JOIN(
// SELECT
//     C.IDUnitatiCazare,
//     MIN(C.Pret) AS StartingPrice
// FROM
//     Camere C
// GROUP BY
//     C.IDUnitatiCazare
// ) MinPrice
// ON
// U.IDUnitatiCazare = MinPrice.IDUnitatiCazare
// LEFT JOIN(
// SELECT
//     C.IDUnitatiCazare,
//     COUNT(DISTINCT FC.IDFacilitati) AS NumberOfFacilities
// FROM
//     Camere C
// LEFT JOIN FacilitatiCamere FC ON
//     C.IDCamera = FC.IDCamera
// GROUP BY
//     C.IDUnitatiCazare
// ) FacCount
// ON
// U.IDUnitatiCazare = FacCount.IDUnitatiCazare
// LEFT JOIN(
// SELECT
//     C.IDUnitatiCazare,
//     GROUP_CONCAT(
//         DISTINCT CONCAT_WS(':', C.IDCamera, C.Pret)
//     ORDER BY
//         C.Pret ASC SEPARATOR '; '
//     ) AS CamereInfo
// FROM
//     Camere C
// GROUP BY
//     C.IDUnitatiCazare
// ) RoomInfo
// ON
// U.IDUnitatiCazare = RoomInfo.IDUnitatiCazare
// LEFT JOIN(
// SELECT
//     C.IDUnitatiCazare,
//     GROUP_CONCAT(
//         DISTINCT FL.Descriere
//     ORDER BY
//         FL.Descriere SEPARATOR ', '
//     ) AS FacilitatiDescriere
// FROM
//     Camere C
// LEFT JOIN FacilitatiCamere FC ON
//     C.IDCamera = FC.IDCamera
// LEFT JOIN Facilitati FL ON
//     FC.IDFacilitati = FL.IdFacilitate
// GROUP BY
//     C.IDUnitatiCazare
// ) FacilityInfo
// ON
// U.IDUnitatiCazare = FacilityInfo.IDUnitatiCazare
// GROUP BY
// U.IDUnitatiCazare;