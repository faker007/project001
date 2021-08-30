import { faSmile, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleNotch,
  faEllipsisV,
  faPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { DB_POST, DB_UserTypes } from "../types/DBService.types";
import { dbService } from "../utils/firebase";
import { Editor } from "./Editor";

export const CampusDetailPost: React.FC<DB_POST> = ({
  groupId,
  comments,
  createdAt,
  body,
  creatorId,
}) => {
  const [creator, setCreator] = useState<DB_UserTypes>({
    displayName: null,
    email: null,
    uid: "",
  });
  const [loading, setLoading] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  const getUserFromUid = async (uid: string) => {
    setLoading(true);
    try {
      const query = dbService.collection("user").where("uid", "==", uid);
      const queryResult = await query.get();

      for (const doc of queryResult.docs) {
        const data = doc.data();
        setCreator({
          displayName: data.displayName,
          email: data.email,
          uid: data.uid,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (creatorId) {
      getUserFromUid(creatorId);
    } else {
      console.log("creatorId is not provided!");
    }
  }, []);

  return (
    <div className="w-full p-5 my-5 border border-black">
      {loading ? (
        <div className="w-full">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-center animate-spin text-5xl text-blue-500"
          />
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between">
            <section className="flex items-center">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-gray-500 text-5xl"
              />
              <div className="ml-3">
                <h1 className="font-medium text-lg">{creator.email}</h1>
                <h2 className="text-sm">{createdAt}</h2>
              </div>
            </section>
            <section>
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="text-gray-500 text-xl cursor-pointer"
              />
            </section>
          </header>
          <main
            className="my-5"
            dangerouslySetInnerHTML={{ __html: body }}
          ></main>
          <aside className="w-full flex items-center justify-between">
            <section className="flex items-center">
              <div className="p-1 px-3 border border-gray-500 rounded-sm hover:opacity-70 transition-opacity mr-3">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                <span>0</span>
              </div>
              <div className="p-1 px-3 border border-gray-500 rounded-sm hover:opacity-70 transition-opacity">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                <FontAwesomeIcon icon={faSmile} className="" />
              </div>
            </section>
            <section>
              댓글 <span className="font-medium">{comments?.length}</span>개
            </section>
          </aside>
          {/* comments should be here */}
          <footer className="mt-10">
            <section className="flex">
              <div
                style={{ width: "10%" }}
                className={`flex justify-center ${
                  editorMode ? "items-start" : "items-center"
                }`}
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="text-4xl text-gray-500  "
                />
              </div>

              <div style={{ width: "90%" }} className="border border-gray-500">
                {editorMode ? (
                  <>
                    <Editor value={editorValue} setValue={setEditorValue} />
                    <div className="w-full flex items-center justify-end p-5">
                      <button
                        onClick={() => {
                          setEditorMode(false);
                          setEditorValue("");
                        }}
                        className="mr-5 px-5 py-2"
                      >
                        취소
                      </button>
                      <button
                        className={`${
                          editorValue.length > 11
                            ? "bg-blue-500 hover:opacity-70"
                            : "bg-gray-500 cursor-not-allowed"
                        } text-white px-5 py-2 transition-all `}
                      >
                        게시하기
                      </button>
                    </div>
                  </>
                ) : (
                  <h1
                    onClick={() => setEditorMode(true)}
                    className="p-3 py-5 w-full  cursor-pointer hover:shadow-md transition-shadow"
                  >
                    댓글을 입력하세요.
                  </h1>
                )}
              </div>
            </section>
          </footer>
        </>
      )}
    </div>
  );
};
