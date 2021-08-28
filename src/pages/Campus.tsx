import {
  faChevronDown,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PopUpLogin } from "../components/PopUpLogin";
import { CAMPUS_GROUPS, routes } from "../utils/constants";
import { isLoggedIn } from "../utils/utils";

export const Campus: React.FC = () => {
  const [popUpLoginMode, setPopUpLoginMode] = useState(false);

  const handleJoinGroup = (e: any) => {
    if (isLoggedIn()) {
      const href = e.target.parentNode.querySelector("a").href;
      const group = href.split("/")[href.split("/").length - 2];
    } else {
      setPopUpLoginMode(true);
    }
  };

  return (
    <main className="max-w-screen-lg mx-auto">
      <section className="flex justify-between items-center mb-10">
        <h1 className="text-3xl">그룹</h1>
        <div className="cursor-pointer">
          <FontAwesomeIcon className="mr-2" icon={faPlus} />
          <span>그룹 추가</span>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between border-b border-black pb-5">
          <div className="flex items-center">
            <span>정렬:</span>
            <div className="flex items-center cursor-pointer">
              <h2 className="pl-3 pr-10">최근활동</h2>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </div>
          <FontAwesomeIcon
            className="text-gray-500 text-xl cursor-pointer"
            icon={faSearch}
          />
        </div>
        {CAMPUS_GROUPS.map((elem, index) => (
          <div
            key={index}
            className="border-b border-black py-5 px-3 flex justify-between  items-center"
          >
            <div className="flex items-center">
              <div className="bg-blue-400 p-9 px-16"></div>
              <div className="w-4/6 px-5">
                <Link
                  to={routes.campusDetail(elem.enName)}
                  className="font-semibold text-lg hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {elem.korName}
                </Link>
                <h5>공개: 회원 0명</h5>
              </div>
            </div>
            <h4
              className="px-10 py-3 border  text-center bg-blue-800 text-white hover:opacity-70 transition-opacity cursor-pointer"
              onClick={handleJoinGroup}
            >
              가입
            </h4>
          </div>
        ))}
      </section>
      {/* popUpLoginMode */}
      {popUpLoginMode && (
        <PopUpLogin
          popUpLoginMode={popUpLoginMode}
          setPopUpLoginMode={setPopUpLoginMode}
        />
      )}
    </main>
  );
};
