// src/ics/parser.js
import ical from 'node-ical';

/**
 * Parses and validates iCal data
 * @param {string} icsData
 * @returns {Object} parsed events
 * @throws if the data is invalid
 */
export function parseICS(icsData) {
    try {
        const parsed = ical.parseICS(icsData);
        if (!parsed || Object.keys(parsed).length === 0) {
            throw new Error('Empty or invalid ICS data');
        }
        return parsed;
    } catch (err) {
        throw new Error(`ICS parsing failed: ${err.message}`);
    }
}