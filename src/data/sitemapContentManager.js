import { sitemapContentData } from './sitemapContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getSitemapContent = () => fetchPageContent('sitemap', sitemapContentData);

export const saveSitemapContent = (content) => persistPageContent('sitemap', content);
