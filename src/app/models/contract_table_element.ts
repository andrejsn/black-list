import { Contract } from '.';

export interface ContractTableElement extends Contract {
  toDelete: boolean;
  visible: boolean;
}
