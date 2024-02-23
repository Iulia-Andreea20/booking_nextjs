import pool from '@utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { IdRezervari, Feedback, IdClient, Rating } = req.body;

        try {
            await pool.query(
                'INSERT INTO FeedbackClienti (IdRezervari, ExperientaCazare, IdClient, Rating) VALUES (?, ?, ?, ?)',
                [IdRezervari, Feedback, IdClient, Rating]
            );

            res.status(200).json({ success: true, message: 'Feedback inserted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error inserting feedback' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
