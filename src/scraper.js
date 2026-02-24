const puppeteer = require('puppeteer');
const config = require('./config');
const { exportData } = require('./exporter');

/**
 * Builds the GitHub Trending URL from config.
 */
function buildURL() {
  const base = 'https://github.com/trending';
  const lang = config.language ? `/${encodeURIComponent(config.language)}` : '';
  const params = new URLSearchParams({ since: config.timeRange });
  return `${base}${lang}?${params.toString()}`;
}

/**
 * Scrapes GitHub trending page and returns an array of repo objects.
 */
async function scrapeTrending() {
  const url = buildURL();
  console.log(`\nScraping: ${url}`);
  console.log(`Language: ${config.language || 'All'} | Range: ${config.timeRange}\n`);

  const browser = await puppeteer.launch({
    headless: config.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let repos = [];

  try {
    const page = await browser.newPage();

    // Set a realistic user agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for repo list to appear
    await page.waitForSelector('article.Box-row', { timeout: 15000 });

    repos = await page.evaluate(() => {
      const articles = document.querySelectorAll('article.Box-row');
      const results = [];

      articles.forEach((article, index) => {
        // Author and repo name
        const repoAnchor = article.querySelector('h2 a');
        const fullName = repoAnchor
          ? repoAnchor.getAttribute('href').replace(/^\//, '').trim()
          : '';
        const [author, name] = fullName.split('/');

        // Description
        const descEl = article.querySelector('p');
        const description = descEl ? descEl.textContent.trim() : '';

        // Language
        const langEl = article.querySelector('[itemprop="programmingLanguage"]');
        const language = langEl ? langEl.textContent.trim() : '';

        // Stars and forks
        const statLinks = article.querySelectorAll('a.Link--muted');
        let stars = 0;
        let forks = 0;
        statLinks.forEach((link) => {
          const svgUse = link.querySelector('svg use');
          const href = svgUse ? svgUse.getAttribute('href') : '';
          const text = link.textContent.trim().replace(/,/g, '');
          if (href && href.includes('star')) stars = parseInt(text, 10) || 0;
          if (href && href.includes('fork')) forks = parseInt(text, 10) || 0;
        });

        // Stars today
        const starsTodayEl = article.querySelector('span.d-inline-block.float-sm-right');
        let starsToday = 0;
        if (starsTodayEl) {
          const match = starsTodayEl.textContent.match(/([\d,]+)/);
          starsToday = match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
        }

        results.push({
          rank: index + 1,
          author: author || '',
          name: name || '',
          fullName,
          url: `https://github.com/${fullName}`,
          description,
          language,
          stars,
          forks,
          starsToday,
        });
      });

      return results;
    });

    console.log(`Found ${repos.length} trending repositories.`);
  } catch (err) {
    console.error('Scraping failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }

  return repos;
}

/**
 * Main entry point.
 */
(async () => {
  console.log('GitHub Trending Scraper');
  console.log('========================');

  const repos = await scrapeTrending();

  if (repos.length === 0) {
    console.warn('No repositories found. GitHub may have changed their markup.');
    process.exit(1);
  }

  exportData(repos, config.outputFormat);

  console.log('\nDone.');
})();
