export interface DB_UserTypes {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export interface DB_Group {
  enName: string;
  korName: string;
  participants?: string[];
  posts?: string[];
}
