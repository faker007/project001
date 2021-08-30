import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CampusHeader } from "../components/CampusHeader";
import { CampusDetailUseParamsTypes } from "../types/CampusDetail.types";
import { CampusTab } from "../types/CampusHeader.types";
import { dbService } from "../utils/firebase";

export const CampusMembers: React.FC = () => {
  const { campus } = useParams<CampusDetailUseParamsTypes>();
  const [groupIns, setGroupIns] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const loadGroupIns = async () => {
    const query = dbService.collection("group").where("enName", "==", campus);
    const queryResult = await query.get();

    for (const group of queryResult.docs) {
      setGroupIns(group.data());
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadGroupIns();
  }, []);

  console.log(groupIns);

  return (
    <div className="max-w-screen-lg mx-auto pb-20">
      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-blue-500 animate-spin text-3xl"
          />
        </div>
      ) : (
        <>
          <CampusHeader
            groupIns={groupIns}
            campus={campus}
            tab={CampusTab.members}
          />
        </>
      )}
    </div>
  );
};
