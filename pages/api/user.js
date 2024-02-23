export default async function handler(req, res) {
    const userId = retrieveUserIdFromSessionOrToken(req);

    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const userDetails = await getUserDetailsFromDatabase(userId);

        res.status(200).json({ success: true, data: userDetails });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}