import { transformICSEvents } from './transformer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('transformEvents', () => {
    it('should split multi-day events into separate events per day', async () => {
        const icsPath = path.join(__dirname, './../../mock/response.ics');
        const rawICS = fs.readFileSync(icsPath, 'utf-8');
        console.log('type of icsData:', typeof rawICS);
        console.log('rawICS:', rawICS);

        const result = transformICSEvents(rawICS);

        // Basic checks
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);

        // Check if multi-day events are split correctly
        const multiDayEvent = result.filter(e => e.uid.includes('0be4f79c3f2fa257'));
        expect(multiDayEvent.length).toBe(2);

        // Check if isAllDay is properly set
        for (const evt of result) {
            expect(evt).toHaveProperty('isAllDay', true);
        }
    });
});
