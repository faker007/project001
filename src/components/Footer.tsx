import { routes } from "../utils/constants";
import { FaceBookLogo, LinkLogo, TwitterLogo } from "./SocialComponents";

export const Footer: React.FC = () => {
  return (
    <div className="w-full py-10  flex flex-col items-center justify-center">
      <div className="mb-5">
        <a
          href={"mailto:lacun749@gmail.com"}
          className="font-light text-gray-400"
        >
          lacun749@gmail.com
        </a>
      </div>
      <div className="w-1/12 flex items-center justify-between">
        <FaceBookLogo />
        <TwitterLogo />
        <LinkLogo url={routes.naver} />
        <LinkLogo url={routes.google} />
      </div>
      <div className="mt-5">
        <span className="tracking-widest font-light text-gray-400 text-sm">
          ©2021 by <span className="text-black">커뮤니티 사이트</span> Proudly
          created with Wix.com
        </span>
      </div>
    </div>
  );
};
