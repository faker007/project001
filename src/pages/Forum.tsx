import { faCircleNotch, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { ForumGroup } from "../components/ForumGroup";
import { ForumGroupTypes } from "../types/Forum.types";
import { dbService } from "../utils/firebase";

export const Forum: React.FC = () => {
  const [forumGroup, setForumGroup] = useState<ForumGroupTypes[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadForumGroup = async () => {
    let arr: ForumGroupTypes[] = [];

    const query = dbService.collection("forumGroup");
    const result = await query.get();

    for (const doc of result.docs) {
      if (doc.exists) {
        const data: ForumGroupTypes = {
          enName: doc.get("enName"),
          korName: doc.get("korName"),
          participants: doc.get("participants"),
          posts: doc.get("posts"),
          views: doc.get("views"),
        };
        console.log(data);
        arr.push(data);
      }
    }

    const freedomCommu = arr.find((elem) => elem.korName === "자유게시판");
    if (freedomCommu) {
      const alteredArr = arr.filter((elem) => elem.korName !== "자유게시판");
      alteredArr.unshift(freedomCommu);
      arr = alteredArr;
    }

    setForumGroup([...arr]);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadForumGroup();
    setMenuOpen(false);
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto">
      {!loading ? (
        <>
          <section className="w-full flex items-center justify-between mb-5">
            <h1 className="text-3xl font-medium">게시판</h1>
            <div className="w-1/5 border-b border-black">
              <FontAwesomeIcon
                className="text-xl text-gray-500 mb-1"
                icon={faSearch}
              />
            </div>
          </section>
          <section
            className="w-full h-80 bg-cover bg-center flex flex-col justify-center items-center "
            style={{
              backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/forum.webp?alt=media&token=0d2f2686-69ea-44fe-8470-4d1a5535d222")`,
            }}
          >
            <h1 className="text-6xl font-medium mb-5">만남의 광장</h1>
            <h2 className="text-lg font-medium">
              멘토링, 과팅, 미팅, 소모임, 동아리, 스터디 등등의 교류활동이
              이루어지는 게시판입니다.
            </h2>
          </section>
          <section className="w-full flex justify-end items-center mt-5">
            <button className="relative bg-blue-800 text-white px-5 py-2 hover:opacity-70 transition-all">
              게시물 작성하기
            </button>
          </section>
          <section className="mt-5">
            {forumGroup.length > 0 &&
              forumGroup.map((elem, index) => (
                <ForumGroup {...elem} key={index} />
              ))}
          </section>
        </>
      ) : (
        <div className="w-full  text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl animate-spin text-blue-500"
          />
        </div>
      )}
    </div>
  );
};
