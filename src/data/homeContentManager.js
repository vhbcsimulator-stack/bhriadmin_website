import { homeContentData } from './homeContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getHomeContent = () => fetchPageContent('home', homeContentData);

export const saveHomeContent = (content) => persistPageContent('home', content);
