import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-full h-screen min-h-screen bg-white flex justify-center items-center flex-col">
      <FontAwesomeIcon
        icon={faCircleNotch}
        className="text-gray-800 text-5xl animate-spin "
      />
      <span className="mt-3 text-xl font-semibold">Loading...</span>
    </div>
  );
};
