export type Guest = {
  id: number;
  name: string;
  has_plus_one: number;
  is_coming?: number | null;
  updated_at?: string;
};