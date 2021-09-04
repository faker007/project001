import { DB_COMMENT, DB_UserTypes } from "./DBService.types";

export interface ForumGroupTypes {
  enName: string;
  korName: string;
  participants: string[];
  posts: string[];
  views: number;
}

export interface ForumPostTypes {
  body: string;
  comments: string[];
  createdAt: number;
  creatorId: string;
  forumGroupId: string;
  id: string;
  views: number;
  title: string;
  imgUrlList: string[];
}

export interface ForumDetailPostTypes {
  post: ForumPostTypes;
  forumGroup: string;
}

export interface ForumPostCommentTypes {
  comment: DB_COMMENT;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}
