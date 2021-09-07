import moment from "moment";
import { toast } from "react-toastify";
import { DB_Group, DB_UserTypes } from "../types/DBService.types";
import { ForumGroupTypes, ForumPostTypes } from "../types/Forum.types";
import { CAMPUS_GROUPS } from "./constants";
import { authService, dbService, storageService } from "./firebase";

export const getMinimizedStr = (str: string): string => {
  let result = str;
  if (str.length > 10) {
    result = result.slice(0, 10);
    result += "...";
  }
  return result;
};

export const isLoggedIn = (): boolean => {
  return Boolean(authService.currentUser?.uid);
};

export const initGroups = async () => {
  for (const group of CAMPUS_GROUPS) {
    const dbGroup: DB_Group = {
      enName: group.enName,
      korName: group.korName,
      participants: [],
      posts: [],
    };
    await dbService.collection("group").add(dbGroup);
  }
};

export const findGroupId = async (group: string): Promise<string> => {
  let result = "";
  try {
    const query = dbService.collection("group").where("enName", "==", group);
    const queryResult = await query.get();

    for (const doc of queryResult.docs) {
      if (doc.id) {
        result = doc.id;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const findForumGroupId = async (group: string): Promise<string> => {
  let result = "";
  try {
    const query = dbService
      .collection("forumGroup")
      .where("enName", "==", group);
    const queryResult = await query.get();

    for (const doc of queryResult.docs) {
      if (doc.id) {
        result = doc.id;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const getUserFromUid = async (
  uid: string
): Promise<DB_UserTypes | null> => {
  try {
    const query = dbService.collection("user").where("uid", "==", uid);
    const queryResult = await query.get();

    for (const doc of queryResult.docs) {
      const data = doc.data();
      return {
        displayName: data.displayName,
        email: data.email,
        uid: data.uid,
      };
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const timeCalc = (time: number): string => {
  let result = "";

  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const phrase = `${year}${month < 10 ? `0${month}` : month}${
    day < 10 ? `0${day}` : day
  } ${hours < 10 ? `0${hours}` : hours}${
    minutes < 10 ? `0${minutes}` : minutes
  }`;

  result = moment(phrase, "YYYYMMDD HHmm").fromNow();

  return result;
};

export const deleteImgFromFirebase = async (imgUrl: string) => {
  try {
    const imgRef = storageService.refFromURL(imgUrl);
    console.log(imgRef);
    if (imgRef) {
      await imgRef.delete();
    }
  } catch (error) {
    console.log(error);
  }
};

export const loadGroupIns = async (
  forumGroup: string
): Promise<ForumGroupTypes | null> => {
  try {
    const query = dbService
      .collection("forumGroup")
      .where("enName", "==", forumGroup);
    const result = await query.get();

    for (const doc of result.docs) {
      if (doc.exists) {
        return {
          enName: doc.data().enName,
          korName: doc.data().korName,
          posts: doc.data().posts,
          views: doc.data().views,
        };
      }
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const handleDeleteForumPost = async (
  post: ForumPostTypes
): Promise<boolean> => {
  if (!isLoggedIn()) {
    return false;
  }

  if (!post || post.creatorId != authService.currentUser?.uid) {
    toast.error("해당 게시물을 지울 권한이 없습니다.");
    return false;
  }

  try {
    // delete from forumGroup
    const forumGroupQuery = dbService.doc(`forumGroup/${post.forumGroupId}`);
    const forumGroupQueryResult = await forumGroupQuery.get();
    if (forumGroupQueryResult.exists) {
      const forumGroupPosts = forumGroupQueryResult.get("posts");
      if (Array.isArray(forumGroupPosts)) {
        const afterPosts = forumGroupPosts.filter(
          (postId) => postId !== post.id
        );
        await forumGroupQuery.update({
          posts: [...afterPosts],
        });
      }
    }

    // delete comments
    for (const commentId of post.comments) {
      const commentQuery = dbService
        .collection("forumComment")
        .where("id", "==", commentId);
      const commentQueryResult = await commentQuery.get();
      for (const doc of commentQueryResult.docs) {
        if (doc.exists) {
          // 이미지가 있으면 삭제
          const commentImgList = doc.get("imgUrlList");
          if (commentImgList && Array.isArray(commentImgList)) {
            for (const imgUrl of commentImgList) {
              await deleteImgFromFirebase(imgUrl);
            }
          }

          console.log(doc.id);

          await dbService.doc(`forumComment/${doc.id}`).delete();
        }
      }
    }
    // delete post
    const postQuery = dbService
      .collection("forumPost")
      .where("id", "==", post.id);
    const postQueryResult = await postQuery.get();

    for (const doc of postQueryResult.docs) {
      if (doc.exists) {
        // 이미지가 있으면 삭제
        const postImgList = doc.get("imgUrlList");
        if (postImgList && Array.isArray(postImgList)) {
          for (const imgUrl of postImgList) {
            await deleteImgFromFirebase(imgUrl);
          }
        }
        await dbService.doc(`forumPost/${doc.id}`).delete();
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
