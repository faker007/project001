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
}

export interface ForumDetailPostTypes {
  post: ForumPostTypes;
  forumGroup: string;
}
