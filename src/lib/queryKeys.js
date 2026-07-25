// Central list of cache keys so queries and mutations can never drift apart.
export const queryKeys = {
  // One entry for the whole site_content table — every page editor reads its
  // slice out of this single cached response instead of firing its own request.
  siteContent: ['site-content'],
  properties: ['properties'],
  applicants: ['applicants'],
};
