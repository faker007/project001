import { faCommentAlt, faEye } from "@fortawesome/free-regular-svg-icons";
import {
  faBell,
  faChevronRight,
  faCircleNotch,
  faEllipsisV,
  faSearch,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Editor } from "../components/Editor";
import { DB_UserTypes } from "../types/DBService.types";
import { ForumGroupTypes, ForumPostTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";
import { authService, dbService } from "../utils/firebase";
import { loadGroupIns, timeCalc } from "../utils/utils";

export const ForumPostDetail: React.FC = () => {
  const { forumGroup, postId } =
    useParams<{ forumGroup: string; postId: string }>();

  const [post, setPost] = useState<ForumPostTypes | null>(null);
  const [group, setGroup] = useState<ForumGroupTypes>();
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState<DB_UserTypes | null>(null);
  const [commentEditorValue, setCommentEditorValue] = useState<string>("");
  const [commentimgList, setCommentimgList] = useState<string[]>([]);
  const history = useHistory();

  const loadPostFromId = async () => {
    try {
      const query = dbService.collection("forumPost").where("id", "==", postId);
      const result = await query.get();

      for (const doc of result.docs) {
        if (doc.exists) {
          setPost({
            body: doc.data().body,
            comments: doc.data().comments,
            createdAt: doc.data().createdAt,
            creatorId: doc.data().creatorId,
            forumGroupId: doc.data().forumGroupId,
            id: doc.data().id,
            title: doc.data().title,
            views: doc.data().views,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupInstance = async () => {
    const groupIns = await loadGroupIns(forumGroup);
    if (groupIns) {
      setGroup(groupIns);
    }
  };

  const loadCreator = async (creatorId: string) => {
    try {
      const query = dbService.collection("user").where("uid", "==", creatorId);
      const result = await query.get();

      for (const doc of result.docs) {
        if (doc.exists) {
          setCreator({
            displayName: doc.data().displayName,
            email: doc.data().email,
            uid: doc.data().uid,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchGroupInstance();
    loadPostFromId();
  }, []);

  useEffect(() => {
    if (post !== null) {
      loadCreator(post.creatorId);
    }
  }, [post]);

  return (
    <div className="max-w-screen-lg mx-auto">
      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl text-blue-500 animate-spin"
          />
        </div>
      ) : (
        <>
          <header className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-5">
            <div className="flex items-center">
              <Link to={routes.forum} className="hover:underline">
                게시판
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="mx-5" />
              <Link
                className="hover:underline"
                to={routes.forumDetail(forumGroup)}
              >
                {group?.korName}
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="mx-5" />
              <h1>{post?.title}</h1>
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
          </header>
          {post && creator && (
            <div className="mt-5 flex">
              <div className="w-3/4">
                <section className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-gray-500 text-2xl mr-3"
                    />
                    <span className="text-sm">{creator.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm">
                      {post && timeCalc(post.createdAt)}
                    </span>
                    <FontAwesomeIcon
                      icon={faEllipsisV}
                      className="text-gray-500 cursor-pointer text-lg hover:opacity-70 transition-all"
                    />
                  </div>
                </section>
                <section className="mt-5 ">
                  <h1 className="text-4xl font-medium">{post.title}</h1>
                </section>
                <section
                  className="mt-5"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                ></section>
                <footer className="mt-20">
                  <div className="border border-gray-300 p-5">
                    <section className="p-5  flex items-center border-b border-gray-300">
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-gray-500 text-3xl mr-3"
                      />
                      <span className="font-medium">
                        {authService.currentUser?.email}
                      </span>
                    </section>
                    <Editor
                      value={commentEditorValue}
                      setValue={setCommentEditorValue}
                      imgUrlList={commentimgList}
                      setImgUrlList={setCommentimgList}
                    />
                    <section className="flex items-center justify-end">
                      <button className="mr-5 px-10 py-3 hover:opacity-60 transition-all">
                        취소
                      </button>
                      <button className="px-14 py-2 bg-blue-800 text-white hover:opacity-60 transition-all">
                        게시
                      </button>
                    </section>
                  </div>
                </footer>
              </div>
              <div className="w-1/4 p-5 pt-0 px-6 flex flex-col items-center">
                <section className="mb-5 flex flex-col w-full">
                  <button className="hover:opacity-70  transition-all w-full text-center bg-blue-800 text-white mb-3 py-2">
                    댓글
                  </button>
                  <button className="hover:opacity-70 transition-all w-full border border-blue-800 py-2">
                    <FontAwesomeIcon
                      className="text-blue-800 text-xl mr-3"
                      icon={faBell}
                    />
                    <span className="text-blue-800">게시물 팔로우</span>
                  </button>
                </section>
                <section className="w-full border border-gray-300 p-5">
                  <div className="mb-5">
                    <FontAwesomeIcon icon={faEye} className="text-xl mr-3" />
                    <span>조회수 {post.views}회</span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faCommentAlt}
                      className="text-xl mr-3"
                    />
                    <span>댓글 {post.comments.length}개</span>
                  </div>
                </section>
                <section className="mt-5 p-5 w-full border border-gray-300">
                  <h1 className="mb-3">유사 게시물</h1>
                </section>
                <section className="mt-5 p-5 w-full border border-gray-300">
                  <h1 className="mb-3 font-medium">카테고리</h1>
                  <ul>
                    <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                      <Link to={routes.forumDetail("jayugesipan")}>
                        자유게시판
                      </Link>
                    </li>
                    <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                      <Link to={routes.forumDetail("mentoring-cunceon")}>
                        멘토링 (춘천)
                      </Link>
                    </li>
                    <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                      <Link to={routes.forumDetail("gwating-cunceon")}>
                        과팅 (춘천)
                      </Link>
                    </li>
                    <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                      <Link to={routes.forumDetail("miting-cunceon")}>
                        미팅 (춘천)
                      </Link>
                    </li>
                    <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                      <Link to={routes.forumDetail("somoim-cunceon")}>
                        소모임 (춘천)
                      </Link>
                    </li>
                    <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                      <Link to={routes.forum}>전체 카테고리 보기</Link>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
