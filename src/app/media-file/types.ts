export class MediaFile {
  id: number;
  format: string;
  url: string;
  mime: string;
  name: string;
  location: Location;
};
export class Location {
  lat: number;
  lng: number;
};
