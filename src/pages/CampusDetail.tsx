import { useParams } from "react-router-dom";
import { CampusDetailUseParamsTypes } from "../types/CampusDetail.types";

export const CampusDetail: React.FC = () => {
  const { campus } = useParams<CampusDetailUseParamsTypes>();

  console.log(campus);
  return <div className="max-w-screen-lg mx-auto">Hello {campus}</div>;
};
