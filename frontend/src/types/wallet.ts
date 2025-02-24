export type Wallet = {
  address: string;
  balance: string;
  sequence: number;
  ledger_index: number;
  flags: number;
  owner_count: number;
  previous_txn_id: string;
  previous_txn_lgr_seq: number;
  sufficient_balance: boolean;
};