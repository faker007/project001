import {
  faCommentAlt,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
  faCircleNotch,
  faEllipsisV,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ForumGroupTypes, ForumPostTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";
import { dbService } from "../utils/firebase";
import { findForumGroupId } from "../utils/utils";

export const ForumDetail: React.FC = () => {
  const { forumGroup } = useParams<{ forumGroup: string }>();
  const [posts, setPosts] = useState<ForumPostTypes[]>([]);
  const [group, setGroup] = useState<ForumGroupTypes>();
  const [loading, setLoading] = useState(false);

  const loadForumGroupPosts = async () => {
    if (group) {
      try {
        const arr: ForumPostTypes[] = [];

        const query = dbService
          .collection("forumPost")
          .where("forumGroupId", "==", await findForumGroupId(forumGroup));
        const result = await query.get();

        for (const doc of result.docs) {
          if (doc.exists) {
            const elem: ForumPostTypes = {
              body: doc.data().body,
              comments: doc.data().comments,
              createdAt: doc.data().createdAt,
              creatorId: doc.data().creatorId,
              forumGroupId: doc.data().forumGroupId,
              id: doc.data().id,
              views: doc.data().views,
            };

            arr.push(elem);
          }
        }

        setPosts([...arr]);
      } catch (error) {
        console.log(error);
      }
    }

    setLoading(false);
  };
  const loadGroupIns = async () => {
    try {
      const query = dbService
        .collection("forumGroup")
        .where("enName", "==", forumGroup);
      const result = await query.get();

      for (const doc of result.docs) {
        if (doc.exists) {
          setGroup({
            enName: doc.data().enName,
            korName: doc.data().korName,
            participants: doc.data().participants,
            posts: doc.data().posts,
            views: doc.data().views,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadGroupIns();
    loadForumGroupPosts();
  }, []);

  return (
    <main className="max-w-screen-lg mx-auto">
      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl animate-spin text-blue-500"
          />
        </div>
      ) : (
        <>
          <section className="w-full flex items-center justify-between mb-5">
            <div className="flex items-center">
              <Link to={routes.forum} className="hover:underline">
                게시판
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="mx-5" />
              <h1>{group?.korName}</h1>
            </div>
            <div className="w-1/4 flex items-center ">
              <div className="border-b border-black w-5/6">
                <FontAwesomeIcon
                  className="text-xl text-gray-500 mb-1"
                  icon={faSearch}
                />
              </div>
              <div className="w-1/6 flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="text-xl text-gray-500"
                />
              </div>
            </div>
          </section>
          {forumGroup === "jayugesipan" && (
            <section
              className="w-full h-80 bg-cover bg-center relative flex justify-center items-center"
              style={{
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/jagebig.webp?alt=media&token=7c90f12c-7ee8-4b73-a998-b056bfd5c8ca")`,
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 "></div>
              <h1 className="z-10 text-white text-xl">
                게시글을 새로 작성하거나 편집해보세요.
              </h1>
            </section>
          )}
          {posts.length > 0 ? (
            <section></section>
          ) : (
            <section className="flex flex-col justify-center items-center w-full border border-black mt-20 py-20">
              <h1 className="text-4xl font-medium ">
                게시물을 작성하시겠습니까?
              </h1>
              <h2 className="mt-5 text-lg">
                첫 카테고리 게시물을 작성해보세요.
              </h2>
              <section className="flex mt-14">
                <Link
                  to={routes.forumCreatePost(forumGroup)}
                  className="flex items-start p-5 border border-black hover:text-blue-500 cursor-pointer transition-all"
                >
                  <FontAwesomeIcon icon={faCommentAlt} className="mr-3 mt-2" />
                  <div>
                    <h1 className="text-lg font-medium">그룹 대화</h1>
                    <h2 className="mt-2">다른 회원들과 대화를 나눠보세요.</h2>
                  </div>
                </Link>
                <Link
                  to={routes.forumCreateQuestion(forumGroup)}
                  className="flex p-5 border-t border-b border-r border-black hover:text-blue-500 cursor-pointer transition-all"
                >
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="mr-3 mt-2"
                  />
                  <div>
                    <h1 className="text-lg font-medium">문의 게시물</h1>
                    <h2 className="mt-2">직접 커뮤니티 답변을 받아보세요.</h2>
                  </div>
                </Link>
              </section>
            </section>
          )}
        </>
      )}
    </main>
  );
};
