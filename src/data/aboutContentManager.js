import { aboutContentData } from './aboutContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getAboutContent = () => fetchPageContent('about', aboutContentData);

export const saveAboutContent = (content) => persistPageContent('about', content);
