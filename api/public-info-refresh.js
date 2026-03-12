export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { supplier_name, supplier_website } = req.body || {};
  const now = new Date().toISOString();

  const newsItems = [];

  try {
    const baseUrl = process.env.NEWS_API_BASE_URL;
    const apiKey = process.env.NEWS_API_KEY;

    if (baseUrl && apiKey && supplier_name) {
      const url = `${baseUrl}?q=${encodeURIComponent(supplier_name)}&pageSize=5`;

      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();

        if (Array.isArray(data.articles)) {
          for (const article of data.articles) {
            newsItems.push({
              id:
                article.url ||
                article.id ||
                Math.random().toString(36).slice(2),
              title: article.title || 'Untitled article',
              source_name:
                (article.source && article.source.name) || 'Unknown',
              published_at: article.publishedAt || now,
              sentiment: 'Neutral',
              short_summary: article.description || '',
              url: article.url,
              tags: ['news'],
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching news', err);
  }

  const public_info_overall_status =
    newsItems.length === 0 ? 'NoRecentAdverseEvents' : 'MinorAdverseEvents';

  const response = {
    public_info_last_refreshed_at: now,
    public_info_news_items: newsItems,
    public_info_breaches: [],
    public_info_regulatory_events: [],
    public_info_financial_events: [],
    public_info_overall_status,
  };

  return res.status(200).json(response);
}
