const baseUrl = process.env.NEWS_API_BASE_URL;
const apiKey = process.env.NEWS_API_KEY;

if (baseUrl && apiKey && supplier_name) {
  const url =
    `${baseUrl}?q=${encodeURIComponent(supplier_name)}` +
    `&language=en&pageSize=5&sortBy=publishedAt&apiKey=${apiKey}`;

  const resp = await fetch(url);

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
