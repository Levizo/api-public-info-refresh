export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = new Date().toISOString();

  res.status(200).json({
    public_info_last_refreshed_at: now,
    public_info_news_items: [],
    public_info_breaches: [],
    public_info_regulatory_events: [],
    public_info_financial_events: [],
    public_info_overall_status: 'NoRecentAdverseEvents'
  });
}
