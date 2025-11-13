export interface DbChangePayload {
  table: string;
  operation: string;
  primary_key?: { id?: string | number };
  changed_at?: string;
  changes?: Array<{
    column: string;
    old_value?: any;
    new_value?: any;
  }>;
  column?: string;
  old_value?: any;
  new_value?: any;
}

export interface UiChangeRow {
  table: string;
  oldName?: string;
  newName?: string;
  oldGender?: string;
  newGender?: string;
  changedAt?: string;
  friendId?: string;
}
