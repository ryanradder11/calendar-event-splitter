import fs from 'fs';
import { parseICS } from './parser.js';

const sampleICS = fs.readFileSync('./mock/response.ics', 'utf-8');

test('parses valid ICS content', () => {
    const result = parseICS(sampleICS);
    expect(result).toBeDefined();
    expect(Object.values(result).some(e => e.type === 'VEVENT')).toBe(true);
});