import { useState } from "react";
import { BiSearch, BiSolidMapPin } from "react-icons/bi";
import { useNavigate } from "react-router";
function SearchSection() {
  const navigate = useNavigate();
  const [stage1, setStage1] = useState("");
  const [stage2, setStage2] = useState("");

  const handleStage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStage1(e.target.value);
  };
  const handleStage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStage2(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const stage1 = formData.get("stage1") as string;
    const stage2 = formData.get("stage2") as string;
    navigate(`/?stage1=${stage1}&stage2=${stage2}`);
  };

  const handleMyLocationClick = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // 카카오 REST API 키가 필요합니다
        const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/geo/coord2address.json?apikey=${apiKey}&x=${longitude}&y=${latitude}`,
          {
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
            },
          }
        );

        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
          const address = data.documents[0].address;
          setStage1(address.region_1depth_name); // 서울특별시
          setStage2(address.region_2depth_name); // 강남구
        }
      } catch (error) {
        console.error("주소 변환 실패:", error);
        // 실패 시 기존 방식으로 폴백
        setStage1(latitude.toString());
        setStage2(longitude.toString());
      }
    });
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
            value={stage1}
            onChange={handleStage1Change}
          />
          <input
            type="text"
            placeholder="시/군/구"
            name="stage2"
            className="w-1/2 py-1 px-2 text-lg border-b border-gray-300 focus:outline-none box-border focus:border-primary duration-300"
            value={stage2}
            onChange={handleStage2Change}
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
          onClick={handleMyLocationClick}
        >
          <BiSolidMapPin />내 위치 기반 조회
        </button>
      </form>
    </div>
  );
}
export default SearchSection;
