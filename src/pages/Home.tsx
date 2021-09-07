export const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white mx-auto px-24">
      <div>
        <img
          draggable={false}
          className="mx-auto"
          src="https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/%EC%9A%B0%EB%A6%AC%EB%91%90%EB%A6%AC.webp?alt=media&token=d9d97bb2-b222-4cfe-be86-a9e3e97e0740"
        />
      </div>
      <div className="mt-20 text-center ">
        <h1 className="text-7xl font-semibold text-blue-400 ">
          대학교 친구 만들 땐?
          <br />
          캠퍼스 메이트!{" "}
        </h1>
        <h2 className="mt-10">
          캠퍼스 메이트에서 과팅, 미팅, 멘토링, 스터디, 동아리, 소모임 등등
          다양한 교류 활동을 이용해보세요!
        </h2>
      </div>
    </div>
  );
};
