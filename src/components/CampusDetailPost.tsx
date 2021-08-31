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
import { CampusDetailPostTypes } from "../types/CampusDetail.types";
import { DB_COMMENT, DB_UserTypes } from "../types/DBService.types";
import { authService, dbService } from "../utils/firebase";
import { getUserFromUid, isLoggedIn } from "../utils/utils";
import { Editor } from "./Editor";
import { v4 as uuid } from "uuid";
import { CampusDetailComment } from "./CampusDetailComment";
import { toast } from "react-toastify";

export const CampusDetailPost: React.FC<CampusDetailPostTypes> = ({
  post: { groupId, comments: commentIds, createdAt, body, creatorId, id },
  loginMode,
  setLoginMode,
  posts,
  setPosts,
}) => {
  const [creator, setCreator] = useState<DB_UserTypes>({
    displayName: null,
    email: null,
    uid: "",
  });
  const [loading, setLoading] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [comments, setComments] = useState<DB_COMMENT[]>([]);
  const [postMenuMode, setPostMenuMode] = useState(false);

  const handleCommentSubmit = async () => {
    if (editorValue.length <= 11 || !isLoggedIn()) {
      return;
    }

    const comment: DB_COMMENT = {
      body: editorValue,
      createdAt: Date.now(),
      postID: id,
      id: uuid(),
      replyComments: [],
      creatorId: authService.currentUser ? authService.currentUser.uid : "",
    };

    try {
      const postQuery = dbService
        .collection("post")
        .where("id", "==", comment.postID);
      const queryResult = await postQuery.get();

      for (const doc of queryResult.docs) {
        if (doc.exists) {
          await dbService.doc(`post/${doc.id}`).update({
            comments: [...doc.data().comments, comment.id],
          });
        }
      }

      await dbService.collection("comment").add(comment);

      setComments((prev) => [...prev, comment]);

      setEditorMode(false);
      setEditorValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditorMode = () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
      setEditorMode(false);
    } else {
      setEditorMode(true);
    }
  };

  const loadCreator = async () => {
    setLoading(true);
    if (creatorId) {
      const creator = await getUserFromUid(creatorId);
      if (creator !== null) {
        setCreator(creator);
      }
    }
  };

  const loadComments = async () => {
    const arr: DB_COMMENT[] = [];
    try {
      const query = dbService.collection("comment").where("postID", "==", id);
      const queryResult = await query.get();

      for (const doc of queryResult.docs) {
        const data: DB_COMMENT = {
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          creatorId: doc.data().creatorId,
          id: doc.data().id,
          postID: doc.data().postID,
          replyComments: doc.data().replyComments,
        };
        arr.push(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setComments(arr);
      setLoading(false);
    }
  };

  const deletePostFromGroup = async () => {
    try {
      const groupQuery = dbService.doc(`group/${groupId}`);
      const groupQueryResult = await groupQuery.get();

      if (groupQueryResult.exists) {
        const originalPosts = groupQueryResult.data()?.posts || [];
        if (Array.isArray(originalPosts)) {
          const afterPosts = originalPosts.filter((elem) => elem !== id);
          await groupQuery.update({ posts: afterPosts });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCommentFromPost = async (commentId: string) => {
    const query = dbService.collection("comment").where("id", "==", commentId);
    const queryResult = await query.get();

    for (const doc of queryResult.docs) {
      if (doc.exists) {
        await dbService.doc(`comment/${doc.id}`).delete();
      }
    }
  };

  const handleDeletePost = async () => {
    console.log("Delete this post!");

    if (creator.uid !== authService.currentUser?.uid) {
      alert("해당 게시글을 삭제할 권한이 없습니다.");
      return;
    }

    try {
      const query = dbService.collection("post").where("id", "==", id);
      const queryResult = await query.get();

      for (const doc of queryResult.docs) {
        if (doc.exists) {
          await dbService.doc(`post/${doc.id}`).delete();

          if (doc.data().comments) {
            for (const commentId of doc.data().comments) {
              await deleteCommentFromPost(commentId);
            }
          }
        }
      }

      await deletePostFromGroup();

      const leftPosts = posts.filter((elem) => elem.id !== id);
      setPosts(leftPosts);
      setComments([]);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleClickToExitMenu = () => setPostMenuMode(false);

  useEffect(() => {
    loadCreator();
    loadComments();
  }, []);

  useEffect(() => {
    if (postMenuMode) {
      document.body.onclick = handleClickToExitMenu;
    } else {
      document.body.onclick = null;
    }
  }, [postMenuMode]);

  return (
    <div className="w-full p-5 pb-0 my-5 border border-black">
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
            <section className="relative">
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="text-gray-500 text-xl cursor-pointer hover:opacity-70 transition-opacity "
                onClick={() => setPostMenuMode(true)}
              />
              {postMenuMode && (
                <div
                  className="absolute top-full mt-1 right-0 py-3 bg-white whitespace-nowrap  w-40"
                  style={{
                    boxShadow:
                      "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                  }}
                >
                  <h1
                    onClick={handleDeletePost}
                    className="p-2 px-5 font-medium cursor-pointer hover:bg-gray-200 transition-colors text-center"
                  >
                    삭제
                  </h1>
                </div>
              )}
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
              댓글 <span className="font-medium">{commentIds?.length}</span>개
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
                        onClick={handleCommentSubmit}
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
                    onClick={handleEditorMode}
                    className="p-3 py-5 w-full  cursor-pointer hover:shadow-md transition-shadow"
                  >
                    댓글을 입력하세요.
                  </h1>
                )}
              </div>
            </section>
            <section className="mt-5">
              {comments
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((elem, index) => (
                  <CampusDetailComment
                    comment={elem}
                    key={index}
                    isLast={index === comments.length - 1}
                  />
                ))}
            </section>
          </footer>
        </>
      )}
    </div>
  );
};
