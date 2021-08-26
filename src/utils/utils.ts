import { strictEqual } from "assert";

export const getMinimizedStr = (str: string): string => {
  let result = str;
  if (str.length > 10) {
    result = result.slice(0, 10);
    result += "...";
  }
  return result;
};
