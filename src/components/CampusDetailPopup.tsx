import {
  faTimes,
  faTimesCircle,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { CampusDetailPopupTypes } from "../types/CampusDetail.types";
import { authService } from "../utils/firebase";
import { Editor } from "./Editor";

export const CampusDetailPopup: React.FC<CampusDetailPopupTypes> = ({
  mode,
  setMode,
}) => {
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    window.scrollTo(0, window.scrollY);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-sm flex justify-center items-center">
      <div
        onClick={() => setMode(false)}
        className="fixed top-0 left-0 w-full h-screen bg-black opacity-60"
      ></div>
      <div
        className="z-10 max-w-screen-sm mx-auto w-full h-3/4 bg-white grid "
        style={{ gridTemplateRows: "0.5fr 3.5fr 1fr" }}
      >
        <section className="w-full flex items-center justify-between p-5">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-gray-500 text-5xl mr-3"
            />
            <span className="font-medium">
              {authService.currentUser?.email}
            </span>
          </div>
          <FontAwesomeIcon
            icon={faTimesCircle}
            onClick={() => setMode(false)}
            className="text-4xl hover:text-red-500 transition-colors cursor-pointer text-gray-500"
          />
        </section>
        <section className="w-full h-full overflow-auto">
          <Editor value={editorValue} setValue={setEditorValue} />
        </section>
        <section className="w-full flex items-center justify-end p-5 mt-10">
          <button className="px-14 py-2">취소</button>
          <button className="px-14 py-2 bg-gray-500 text-white font-medium">
            게시
          </button>
        </section>
      </div>
    </div>
  );
};
