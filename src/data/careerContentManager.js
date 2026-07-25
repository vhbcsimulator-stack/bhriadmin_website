import { careerContentData } from './careerContentData';
import { fetchPageContent, persistPageContent } from './contentStore';

export const getCareerContent = () => fetchPageContent('career', careerContentData);

export const saveCareerContent = (content) => persistPageContent('career', content);
