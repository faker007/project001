import { useState } from "react";
import { Editor } from "../components/Editor";

export const Campus: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <div className="w-full min-h-screen bg-white mx-auto px-24">
      <div className="max-w-screen-sm mx-auto ">
        <Editor value={value} setValue={setValue} />
      </div>
      <div
        className="max-w-screen-sm mx-auto my-10"
        dangerouslySetInnerHTML={{ __html: value }}
      ></div>
    </div>
  );
};
