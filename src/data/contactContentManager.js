import { contactContentData } from './contactContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getContactContent = () => fetchPageContent('contact', contactContentData);

export const saveContactContent = (content) => persistPageContent('contact', content);
