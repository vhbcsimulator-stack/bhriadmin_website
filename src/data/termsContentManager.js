import { termsContentData } from './termsContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getTermsContent = () => fetchPageContent('terms', termsContentData);

export const saveTermsContent = (content) => persistPageContent('terms', content);
