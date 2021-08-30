import { DB_Group } from "../types/DBService.types";
import { CAMPUS_GROUPS } from "./constants";
import { authService, dbService } from "./firebase";

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
