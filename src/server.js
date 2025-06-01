const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ICAL_URL = process.env.ICAL_URL;

if (!ICAL_URL) {
    console.error('Error: ICAL_URL is not set in environment variables.');
    process.exit(1);
}

app.get('/calendar.ics', async (req, res) => {
    try {
        const response = await fetch(ICAL_URL);
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        let icsData = await response.text();

        // Manipulatie van ICS kan hier
        // icsData = manipulateICS(icsData);

        res.header('Content-Type', 'text/calendar');
        res.send(icsData);
    } catch (error) {
        console.error('Error fetching or processing ICS:', error);
        res.status(500).send('Failed to retrieve calendar.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
