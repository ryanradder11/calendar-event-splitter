import dayjs from "dayjs";
import ical from "node-ical";

export function transformICSEvents(icsData) {
    const parsed = ical.parseICS(icsData);
    const events = [];

    for (const key in parsed) {
        const vevent = parsed[key];
        if (vevent.type !== 'VEVENT') continue;

        if (vevent.summary.includes("Airbnb (Not available)")) continue;

        if (!vevent.start || !vevent.end) {
            console.warn('Skipping invalid event:', vevent);
            continue;
        }

        const start = dayjs(vevent.start);
        const end = dayjs(vevent.end);
        const isAllDay = vevent.start.dateOnly === true;
        const diff = isAllDay ? end.diff(start, 'day') : end.diff(start, 'day') + 1;

        if (isAllDay && diff > 1) {
            for (let i = 0; i < diff; i++) {
                const currentStart = start.add(i, 'day');
                const currentEnd = currentStart.add(1, 'day');

                events.push({
                    uid: `${vevent.uid}-${i}`,
                    summary: vevent.summary,
                    description: vevent.description || '',
                    date: currentStart.format('YYYY-MM-DD'),
                    start: currentStart.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                    end: currentEnd.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                    isAllDay
                });
            }
        } else {
            const defaultEnd = isAllDay ? start.add(1, 'day') : end;

            events.push({
                uid: vevent.uid,
                summary: vevent.summary,
                description: vevent.description || '',
                date: start.format('YYYY-MM-DD'),
                start: start.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                end: defaultEnd.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                isAllDay
            });
        }
    }

    return events;
}
