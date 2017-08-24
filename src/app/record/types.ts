import { Explorer } from "../explorer/types";
import { MediaFile } from "../media-file/types";
export class Record {
  id: number;
  description: string;
  name: string;
  created: Date;
  explorer: Explorer;
  media: MediaFile[];
  published: boolean;
}

