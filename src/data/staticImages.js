import fallsGif from '../assets/static image/falls.gif';
import chairmanImage from '../assets/static image/board_of_directors_images/chairman-company-profile.png';
import presidentImage from '../assets/static image/board_of_directors_images/pres.png';
import vicePresidentImage from '../assets/static image/board_of_directors_images/vp.png';
import headOfficeImage from '../assets/static image/offices/HEAD-OFFICE-East-West-Breeze-Leisure-Farm-1024x768.jpeg';
import salesOfficeMVLCImage from '../assets/static image/offices/SALES-OFFICE-Mountain-View-Leisure-Community-1024x576.png';
import salesOfficeRTEImage from '../assets/static image/offices/SALES-OFFICE-Royal-Tagaytay-Estates-1024x576.png';
import subsidiaryOfficeImage from '../assets/static image/offices/SUBSIDIARY-OFFICE-Leisure-Community-Philippines-1024x576.png';

// Locally bundled images referenced by a stable key. Stored content keeps the key
// (portable between the admin and public apps); uploaded images replace it with an
// absolute URL in the `image` field.
export const staticImages = {
  falls: fallsGif,
  chairman: chairmanImage,
  president: presidentImage,
  vicePresident: vicePresidentImage,
  headOffice: headOfficeImage,
  salesOfficeMVLC: salesOfficeMVLCImage,
  salesOfficeRTE: salesOfficeRTEImage,
  subsidiaryOffice: subsidiaryOfficeImage
};

// Resolve an item's display image: an uploaded URL wins, otherwise fall back
// to the bundled asset referenced by imageKey.
export const resolveImage = (item) => {
  if (!item) return '';
  return item.image || staticImages[item.imageKey] || '';
};
