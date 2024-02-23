import pool from '@utils/database';

export default async function handler(req, res) {
    const {
        query: { id },
    } = req;
    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query(`SELECT * FROM UnitatiCazare WHERE IDUnitatiCazare = ?`, [id]);
            const property = rows[0];
            if (property) {
                res.status(200).json(property);
            } else {
                res.status(404).json({ message: 'Property not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
