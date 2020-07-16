// TODO: change to enum?
export enum DebtorStatus {
  awaiting = 0, // badge-secondary
  in_work = 1, // badge-primary
  debt_collected = 2, // badge-success
  to_sue = 3, // badge-light
  in_court = 4, // badge-info
  hopeless = 5, // badge-warning
  insolvency = 6, // badge-danger
}
