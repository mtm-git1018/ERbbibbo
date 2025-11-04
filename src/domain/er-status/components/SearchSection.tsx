import { BiSearch, BiSolidMapPin } from "react-icons/bi";
import { useNavigate } from "react-router";
function SearchSection() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const stage1 = formData.get("stage1") as string;
    const stage2 = formData.get("stage2") as string;
    navigate(`/?stage1=${stage1}&stage2=${stage2}`);
  };

  return (
    <div className="flex flex-col py-5 border-b border-gray-300 mb-4">
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-3xl font-bold">응급실 현황 조회</h1>
        <p className="text-sm text-gray-500">현재 검색 위치</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex justify-between gap-2 mb-8 w-full">
          <input
            type="text"
            placeholder="시/도"
            name="stage1"
            className="w-1/2 py-1 px-2 text-lg border-b border-gray-300 focus:outline-none box-border focus:border-primary duration-300"
          />
          <input
            type="text"
            placeholder="시/군/구"
            name="stage2"
            className="w-1/2 py-1 px-2 text-lg border-b border-gray-300 focus:outline-none box-border focus:border-primary duration-300"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-white text-black py-2 rounded-md flex items-center justify-center gap-3 border border-gray-300 box-border"
        >
          <BiSearch />
          검색하기
        </button>
        <button
          type="button"
          className="w-full h-11 bg-secondary text-white py-2 rounded-md flex items-center justify-center gap-3 box-border"
        >
          <BiSolidMapPin />내 위치 기반 조회
        </button>
      </form>
    </div>
  );
}
export default SearchSection;
