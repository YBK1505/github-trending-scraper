# GitHub Trending Scraper

A production-ready Node.js scraper using Puppeteer that extracts trending repositories from [GitHub Trending](https://github.com/trending) and exports the data as **CSV** and **JSON**.

---

## Features

- Scrapes repo name, author, description, language, stars, forks, and today's star count
- Exports to both `output/trending.csv` and `output/trending.json`
- Supports filtering by **language** and **time range** (daily, weekly, monthly)
- Headless browser mode (no GUI required)
- Clean error handling
- Lightweight config via `.env`

---

## Requirements

- Node.js v18+
- npm

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YBK1505/github-trending-scraper.git
cd github-trending-scraper

# 2. Install dependencies
npm install

# 3. Copy the example env file
cp .env.example .env

# 4. Run the scraper
npm start
```

Output files will be saved to the `output/` folder.

---

## Configuration

Edit your `.env` file to customise the scrape:

| Variable | Default | Description |
|---|---|---|
| `LANGUAGE` | `` (all) | Filter by language, e.g. `javascript`, `python` |
| `TIME_RANGE` | `daily` | `daily`, `weekly`, or `monthly` |
| `OUTPUT_FORMAT` | `both` | `csv`, `json`, or `both` |
| `HEADLESS` | `true` | Run browser headlessly (`true` recommended) |

---

## Example Output

### JSON (`output/trending.json`)

```json
[
  {
    "rank": 1,
    "author": "shadcn-ui",
    "name": "ui",
    "fullName": "shadcn-ui/ui",
    "url": "https://github.com/shadcn-ui/ui",
    "description": "Beautifully designed components built with Radix UI and Tailwind CSS.",
    "language": "TypeScript",
    "stars": 89234,
    "forks": 5421,
    "starsToday": 312
  }
]
```

### CSV (`output/trending.csv`)

```
rank,author,name,fullName,url,description,language,stars,forks,starsToday
1,shadcn-ui,ui,shadcn-ui/ui,https://github.com/shadcn-ui/ui,Beautifully designed components...,TypeScript,89234,5421,312
```

---

## Project Structure

```
github-trending-scraper/
├── src/
│   ├── scraper.js       # Core Puppeteer scraping logic
│   ├── exporter.js      # CSV and JSON export logic
│   └── config.js        # Config loader from .env
├── output/              # Generated output files (gitignored)
├── .env.example         # Example environment config
├── .gitignore
├── package.json
└── README.md
```

---

## Troubleshooting

**Puppeteer fails to launch on Linux/CI?**
```bash
npm install puppeteer --unsafe-perm=true
```
Or set `HEADLESS=true` in your `.env`.

**No output files generated?**
The `output/` directory is created automatically on first run.

---

## License

MIT
