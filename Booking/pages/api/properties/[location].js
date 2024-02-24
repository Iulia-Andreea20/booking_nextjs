import pool from '@Booking/utils/database';
import { min } from 'date-fns';

export default async function handler(req, res) {
    const { minPrice, maxPrice, location, sort, searchTerm, facilities } = req.query;

    let orderByClause = '';
    let queryParams = [];
    let querryToExecute = '';
    let whereClauses = [];

    switch (sort) {
        case 'rating':
            orderByClause = 'AverageRating DESC';
            break;
        case 'price':
            orderByClause = 'StartingPrice ASC';
            break;
        case 'facilities':
            orderByClause = 'NumberOfFacilities DESC';
            break;
        default:
            orderByClause = 'U.IDUnitatiCazare DESC';
            break;
    }

    if (facilities) {
        whereClauses.push('U.Locatie LIKE ?');
        queryParams.push(`%${location}%`);
        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
            whereClauses.push('U.NumeUnitatiCazare LIKE ?');
        }
        else if (minPrice && maxPrice) {
            queryParams.push(minPrice);
            queryParams.push(maxPrice);
            whereClauses.push('C.Pret BETWEEN ? AND ?');
        }
        const facilitiesArray = facilities.split(',').map(facility => facility.trim());
        const facilitiesConditions = facilitiesArray.map(facility =>
            `EXISTS
            (
            SELECT
                1
            FROM
                Facilitaticamere FC2
            JOIN Facilitati FL2 ON
                FC2.IDFacilitati = FL2.IdFacilitate
            WHERE
                FC2.IDCamera = C.IDCamera AND FL2.Descriere = '${facility}'
        )`).join(' AND ');
        whereClauses.push(facilitiesConditions);

        let querryFacilities = `
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
        WHERE
            (${whereClauses.join(' AND ')})
        GROUP BY
            U.IDUnitatiCazare
        ORDER BY
            ${orderByClause}
            `;

        querryToExecute = querryFacilities;
    }
    else if (minPrice && maxPrice) {
        queryParams.push(minPrice);
        queryParams.push(maxPrice);
        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        queryParams.push(`%${location}%`);

        let priceRangeQuery = `
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
        WHERE
            C.Pret BETWEEN ? AND ? AND
            `

        if (searchTerm) {
            priceRangeQuery += ` U.NumeUnitatiCazare LIKE ? AND`
        }
        priceRangeQuery += ` 
            U.Locatie LIKE ?
        GROUP BY
            U.IDUnitatiCazare
        ORDER BY 
            ${orderByClause}
        `;
        querryToExecute = priceRangeQuery;
    }
    else if (searchTerm) {
        queryParams.push(`%${searchTerm}%`);
        queryParams.push(`%${location}%`);
        let searchQuery = `
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
        LEFT JOIN Camere C ON
            U.IDUnitatiCazare = C.IDUnitatiCazare
        LEFT JOIN Rezervari R ON
            U.IDUnitatiCazare = R.IdUnitatiCazare
        LEFT JOIN FacilitatiCamere FC ON
            C.IDCamera = FC.IDCamera
        LEFT JOIN FeedbackClienti F ON
            R.IdRezervari = F.IdRezervari
        LEFT JOIN Facilitati FL ON
            FC.IDFacilitati = FL.IdFacilitate
        WHERE
            U.NumeUnitatiCazare LIKE ? AND U.Locatie LIKE ?
        GROUP BY
            U.IDUnitatiCazare
        ORDER BY
            ${orderByClause}
            `;

        querryToExecute = searchQuery;
    } else {
        queryParams.push(`%${location}%`);
        const sortQuery = `
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
        WHERE
            U.Locatie LIKE CONCAT('%', ?, '%')
        GROUP BY
            U.IDUnitatiCazare
        ORDER BY
            ${orderByClause}
        `;
        querryToExecute = sortQuery;
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