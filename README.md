# 📆 Calendar Event Splitter

A lightweight Node.js microservice that fetches `.ics` (iCalendar) feeds, applies custom manipulation logic, and returns the modified calendar file. Perfect for proxying, filtering, or transforming Airbnb or Google Calendar feeds.

## 🚀 Features

- 🌐 Fetches remote `.ics` files from any calendar source
- 🔧 Manipulates or filters calendar events on-the-fly *(add your logic!)*
- ⚙️ Runs in Docker for simple deployment
- 🔐 Uses `.env` for secure config

## 🛠 Setup

1. **Clone the repo**

```bash
git clone https://github.com/yourname/calendar-event-splitter.git
cd calendar-event-splitter
```

2. **Install dependencies**

```bash
npm install
```
3. **Create a `.env` file**

```bash
# Example .env file
ICS_SOURCE_URL=https://example.com/calendar.ics
PORT=3000
```

4. **Run the server**

```bash
npm start
```

5. **Run with Docker**

```bash
docker build -t calendar-event-splitter .
docker run -p 3000:3000 --env-file .env calendar-event-splitter
```

