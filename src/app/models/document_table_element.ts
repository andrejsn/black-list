import { Document } from './document';

export interface DocumentTableElement extends Document {
  toDelete: boolean;
  visible: boolean;
}
