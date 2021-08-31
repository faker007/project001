import { DB_COMMENT, DB_POST } from "./DBService.types";

export interface CampusDetailUseParamsTypes {
  campus: string;
}

export interface CampusDetailPopupTypes {
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
  posts: DB_POST[];
  setPosts: React.Dispatch<React.SetStateAction<DB_POST[]>>;
  group: string;
  groupId: string;
}

export interface CampusDetailPostTypes {
  post: DB_POST;
  loginMode: boolean;
  setLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
  posts: DB_POST[];
  setPosts: React.Dispatch<React.SetStateAction<DB_POST[]>>;
}

export interface CampusDetailCommentTypes {
  comment: DB_COMMENT;
  isLast: boolean;
}
