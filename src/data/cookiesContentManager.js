import { cookiesContentData } from './cookiesContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getCookiesContent = () => fetchPageContent('cookies', cookiesContentData);

export const saveCookiesContent = (content) => persistPageContent('cookies', content);
