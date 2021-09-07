import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faEllipsisV,
  faShare,
  faTrashAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DB_UserTypes } from "../types/DBService.types";
import { ForumPostCommentTypes } from "../types/Forum.types";
import { authService, dbService } from "../utils/firebase";
import {
  deleteImgFromFirebase,
  getUserFromUid,
  isLoggedIn,
  timeCalc,
} from "../utils/utils";

export const ForumPostComment: React.FC<ForumPostCommentTypes> = ({
  comment: {
    creatorId,
    imgUrlList,
    postID,
    replyComments,
    body,
    createdAt,
    id,
  },
  setRefetch,
  setLoginMode,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [creator, setCreator] = useState<DB_UserTypes | null>(null);

  const handleDeleteComment = async () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
      return;
    }

    if (authService.currentUser && authService.currentUser.uid !== creatorId) {
      toast.error("해당 댓글을 지울 권한이 없습니다.");
      return;
    }

    try {
      const query = dbService.collection("forumComment").where("id", "==", id);
      const result = await query.get();

      for (const doc of result.docs) {
        if (doc.exists) {
          await dbService.doc(`forumComment/${doc.id}`).delete();

          for (const url of imgUrlList) {
            await deleteImgFromFirebase(url);
          }

          const postQuery = dbService
            .collection("forumPost")
            .where("id", "==", postID);
          const postResult = await postQuery.get();

          for (const doc of postResult.docs) {
            if (doc.exists) {
              await dbService.doc(`forumPost/${doc.id}`).update({
                comments: [
                  ...doc.data().comments.filter((elem: any) => elem !== id),
                ],
              });
            }
          }

          setRefetch(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCreator = async () => {
    const creator = await getUserFromUid(creatorId);

    if (creator) {
      setCreator(creator);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.onclick = () => {
        setMenuOpen(false);
      };
    } else {
      document.body.onclick = null;
    }
  }, [menuOpen]);

  useEffect(() => {
    fetchCreator();
  }, []);

  return (
    <div className="p-5 border-t border-gray-300">
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-gray-500 text-2xl mr-3"
          />
          <span className="text-sm">{creator?.email}</span>
        </div>
        <div className="flex items-center relative">
          <span className="mr-3 text-sm">{timeCalc(createdAt)}</span>
          <FontAwesomeIcon
            onClick={() => setMenuOpen(true)}
            icon={faEllipsisV}
            className="text-gray-500 cursor-pointer text-lg hover:opacity-70 transition-all"
          />
          {menuOpen && (
            <div
              className="absolute top-full right-0 w-48  p-5  bg-white"
              style={{
                boxShadow:
                  "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
              }}
            >
              <div
                onClick={handleDeleteComment}
                className="w-full hover:text-blue-500 transition-all cursor-pointer"
              >
                <FontAwesomeIcon className="mr-5" icon={faTrashAlt} />
                <span>삭제</span>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="py-5" dangerouslySetInnerHTML={{ __html: body }}></main>
      <footer className="flex items-center justify-start">
        <div className="mr-3 cursor-pointer">
          <FontAwesomeIcon className="mr-2 text-blue-500" icon={faShare} />
          <span>댓글</span>
        </div>
        <div className="mr-3 cursor-pointer">
          <FontAwesomeIcon className="mr-2 text-red-500" icon={faHeart} />
          <span>댓글</span>
        </div>
      </footer>
    </div>
  );
};
