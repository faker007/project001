import moment from "moment";
import { DB_Group, DB_UserTypes } from "../types/DBService.types";
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
