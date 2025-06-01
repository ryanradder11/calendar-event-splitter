// src/server.js

// Laad .env-variabelen
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fetch from 'node-fetch';
import { transformICSEvents } from './ics/transformer.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/calender-v3', async (req, res) => {
    try {
        const url = process.env.ICS_SOURCE_URL;
        console.log('Fetching iCal data from:', url);

        if (!url) {
            return res.status(500).send('ICS_SOURCE_URL not set in environment');
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
                'Accept': 'text/calendar, text/html;q=0.9'
            }
        });
        const icsData = await response.text();

        console.log('Fetched iCal data successfully');
        console.log('ICS Data Length:', icsData.length);
        console.log('ICS Data Sample:', icsData.slice(0, 100));


        // Transform
        const transformedEvents = transformICSEvents(icsData);


        // Reconstruct .ics from transformed events
        const transformedICS = buildICS(transformedEvents);


        res.set('Content-Type', 'text/calendar');
        res.send(transformedICS);
    } catch (err) {
        console.error('Error fetching iCal:', err);
        res.status(500).send('Failed to fetch or parse .ics file');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Helper to serialize events back into .ics
function buildICS(events) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'PRODID:-//Custom ICS Generator//EN'
    ];

    for (const event of events) {
        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${event.uid}`);
        lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z`);
        lines.push(`DTSTART;VALUE=DATE:${formatDate(event.start)}`);
        lines.push(`DTEND;VALUE=DATE:${formatDate(event.end)}`);
        if (event.summary) lines.push(`SUMMARY:${event.summary}`);
        if (event.description) lines.push(`DESCRIPTION:${event.description}`);
        lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
}

function formatDate(date) {
    const d = new Date(date);
    if (isNaN(d)) throw new Error(`Invalid date: ${date}`);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}