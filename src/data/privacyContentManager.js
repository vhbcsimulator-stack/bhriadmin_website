import { privacyContentData } from './privacyContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getPrivacyContent = () => fetchPageContent('privacy', privacyContentData);

export const savePrivacyContent = (content) => persistPageContent('privacy', content);
