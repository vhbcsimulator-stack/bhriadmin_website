import { homeContentData } from './homeContentData';
import { aboutContentData } from './aboutContentData';
import { contactContentData } from './contactContentData';
import { careerContentData } from './careerContentData';
import { privacyContentData } from './privacyContentData';
import { termsContentData } from './termsContentData';
import { cookiesContentData } from './cookiesContentData';
import { sitemapContentData } from './sitemapContentData';

// Code defaults per page id, used to fill in fields that are missing from the
// stored content (e.g. sections added after the content was last saved).
export const PAGE_CONTENT_DEFAULTS = {
  home: homeContentData,
  about: aboutContentData,
  contact: contactContentData,
  career: careerContentData,
  privacy: privacyContentData,
  terms: termsContentData,
  cookies: cookiesContentData,
  sitemap: sitemapContentData,
};
