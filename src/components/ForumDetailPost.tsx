import { faEllipsisV, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DB_UserTypes } from "../types/DBService.types";
import { ForumDetailPostTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";
import { getUserFromUid, timeCalc } from "../utils/utils";

export const ForumDetailPost: React.FC<ForumDetailPostTypes> = ({
  post: { title, views, id, forumGroupId, creatorId, comments, createdAt },
  forumGroup,
}) => {
  const [creator, setCreator] = useState<DB_UserTypes | null>(null);

  const loadCreator = async () => {
    const creator = await getUserFromUid(creatorId);
    if (creator !== null) {
      setCreator(creator);
    }
  };

  useEffect(() => {
    loadCreator();
  }, []);

  return (
    <div
      className="grid border-b border-gray-300 py-3 mx-5"
      style={{ gridTemplateColumns: "3fr 1fr 1fr" }}
    >
      <section>
        <Link
          to={routes.forumPostDetail(forumGroup, id)}
          className="text-lg font-medium hover:text-blue-500 transition-all cursor-pointer"
        >
          {title}
        </Link>
        <h2 className="text-sm hover:text-blue-500 transition-all">
          {creator?.email}
        </h2>
      </section>
      <section className="flex items-center justify-between">
        <span className="mr-3">{comments.length}</span>
        <span className="mr-3">{0}</span>
        <span className="mr-3">{views}</span>
      </section>
      <section className="ml-8 flex justify-between items-center">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-gray-500 text-2xl"
        />
        <span className="text-sm">{timeCalc(createdAt)}</span>
        <FontAwesomeIcon
          icon={faEllipsisV}
          className="text-gray-500  cursor-pointer"
        />
      </section>
    </div>
  );
};
