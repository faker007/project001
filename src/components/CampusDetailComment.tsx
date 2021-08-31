import { faHeart, faShareSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleNotch,
  faEllipsisV,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { CampusDetailCommentTypes } from "../types/CampusDetail.types";
import { DB_UserTypes } from "../types/DBService.types";
import { getUserFromUid } from "../utils/utils";

export const CampusDetailComment: React.FC<CampusDetailCommentTypes> = ({
  comment: { postID, replyComments, createdAt, body, creatorId, id },
  isLast,
}) => {
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState<DB_UserTypes>();

  const loadCreator = async () => {
    setLoading(true);

    try {
      const creator = await getUserFromUid(creatorId);
      if (creator !== null) {
        setCreator(creator);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCreator();
  }, []);

  return (
    <div className={`w-full flex ${isLast ? "my-0" : "my-5"}`}>
      {loading ? (
        <FontAwesomeIcon
          icon={faCircleNotch}
          className="text-3xl animate-spin text-blue-500"
        />
      ) : (
        <>
          <div
            style={{ width: "10%" }}
            className="flex justify-center items-start"
          >
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-gray-500 text-3xl"
            />
          </div>
          <div
            style={{ width: "90%" }}
            className={`pb-5 ${
              isLast ? "border-b-0" : "border-b"
            } border-black`}
          >
            <section className="w-full  flex items-center justify-between">
              <div>
                <h1 className="font-medium">{creator?.email}</h1>
                <h2 className="text-sm">{createdAt}</h2>
              </div>
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="text-lg cursor-pointer text-gray-500"
              />
            </section>
            <main
              dangerouslySetInnerHTML={{ __html: body }}
              className="py-5 font-medium"
            ></main>
            <aside className="flex">
              <div className="cursor-pointer hover:opacity-70 transition-all">
                <FontAwesomeIcon icon={faHeart} className="mr-2 text-red-500" />
                <span>좋아요</span>
              </div>
              <div className="ml-5 cursor-pointer hover:opacity-70 transition-all">
                <FontAwesomeIcon icon={faShareSquare} className="mr-2" />
                <span>답글</span>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};
