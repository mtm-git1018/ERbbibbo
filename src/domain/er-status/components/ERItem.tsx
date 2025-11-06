import tw from "@/shared/utils/tw";
import type { EmergencyRoomInfo } from "../api/useGetRltmInfoInqire";
import { BiPhone, BiSolidMapPin } from "react-icons/bi";
import StatusItem from "./StatusItem";
import { Link, useSearchParams } from "react-router";
import { formatDistance } from "@/shared/utils/distance";

interface HospitalLocation {
  created_at?: string;
  dutyAddr?: string | null;
  dutyDiv?: string | null;
  endTime?: string | null;
  startTime?: string | null;
  latitude: number;
  longitude: number;
  distance: number;
}

interface ERItemProps {
  item: EmergencyRoomInfo & HospitalLocation;
  first?: boolean;
}

function ERItem({ item, first }: ERItemProps) {
  const [searchParams] = useSearchParams();

  const handleMapClick = (hospitalName: string) => {
    const encodedName = encodeURIComponent(hospitalName);

    // 모바일에서 카카오맵 앱 실행 시도
    if (
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      window.location.href = `kakaomap://search?q=${encodedName}`;

      // 앱이 없으면 3초 후 웹으로 이동
      setTimeout(() => {
        window.open(
          `https://map.kakao.com/link/search/${encodedName}`,
          "_blank"
        );
      }, 3000);
    } else {
      // 데스크톱에서는 웹으로 바로 이동
      window.open(`https://map.kakao.com/link/search/${encodedName}`, "_blank");
    }
  };

  return (
    <li className="flex flex-col gap-4">
      <Link
        to={`/detail?${searchParams.toString()}`}
        state={{ item }}
        className="flex flex-col gap-4"
      >
        {/* 이름, 전화번호 */}
        <div className="flex flex-col gap-1">
          {first && <p className="text-sm text-[#F85F3B]">가장 가까운</p>}
          {item.distance && (
            <p className="text-primary font-semibold">
              {formatDistance(item.distance)}
            </p>
          )}
          <h3 className="text-2xl font-bold">{item.dutyName}</h3>
          <p className="text-sm text-gray-500">{item.dutyTel3}</p>
        </div>

        {/* 병상 현황 */}
        <div className="grid grid-cols-3 gap-2">
          {item.hvec !== undefined && (
            <StatusItem
              cur={Math.max(0, item.hvs01 - item.hvec)}
              max={item.hvs01}
              name="응급실"
            />
          )}

          {item.hvicc !== undefined && item.hvs31 > 0 && (
            <StatusItem
              cur={Math.max(0, (item.hvs31 || 0) - item.hvicc)}
              max={item.hvs31 || 0}
              name="중환자실"
            />
          )}

          {item.hvoc !== undefined && item.hvoc > 0 && (
            <StatusItem
              cur={Math.max(0, (item.hvs31 || item.hvs01) - item.hvoc)}
              max={item.hvs32 || item.hvs01}
              name="수술실"
            />
          )}

          {item.hvncc !== undefined && item.hvncc > 0 && (
            <StatusItem
              cur={Math.max(0, (item.hvs33 || 0) - item.hvncc)}
              max={item.hvs33 || 0}
              name="신생아중환자실"
            />
          )}

          {item.hvs02 !== undefined && item.hvs02 > 0 && (
            <StatusItem
              cur={Math.max(0, item.hvs02 - (item.hv2 || 0))}
              max={item.hvs02}
              name="소아응급실"
            />
          )}

          {item.hvs03 !== undefined &&
            item.hv3 !== undefined &&
            item.hv3 > 0 && (
              <StatusItem
                cur={Math.max(0, item.hvs03 - item.hv3)}
                max={item.hvs03}
                name="분만실"
              />
            )}

          {item.hvs04 !== undefined && item.hvs04 > 0 && (
            <StatusItem
              cur={Math.max(0, item.hvs04 - (item.hv30 || 0))}
              max={item.hvs04}
              name="격리실"
            />
          )}
        </div>

        {/* 도구 사용 가능 여부  */}
        <div className="flex gap-2 items-center justify-end">
          <div className="flex items-center gap-1">
            CT{" "}
            <div
              className={tw(
                "w-0.5 h-4 rounded-full",
                item.hvctayn === "Y" ? "bg-primary" : "bg-gray-300"
              )}
            />{" "}
            <span
              className={tw(
                item.hvctayn === "Y" ? "text-primary" : "text-gray-500"
              )}
            >
              {item.hvctayn === "Y" ? "가능" : "불가"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            MRI{" "}
            <div
              className={tw(
                "w-0.5 h-4 rounded-full",
                item.hvmriayn === "Y" ? "bg-primary" : "bg-gray-300"
              )}
            />{" "}
            <span
              className={tw(
                item.hvmriayn === "Y" ? "text-primary" : "text-gray-500"
              )}
            >
              {item.hvmriayn === "Y" ? "가능" : "불가"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            조영{" "}
            <div
              className={tw(
                "w-0.5 h-4 rounded-full",
                item.hvangioayn === "Y" ? "bg-primary" : "bg-gray-300"
              )}
            />{" "}
            <span
              className={tw(
                item.hvangioayn === "Y" ? "text-primary" : "text-gray-500"
              )}
            >
              {item.hvangioayn === "Y" ? "가능" : "불가"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            인공호흡기{" "}
            <div
              className={tw(
                "w-0.5 h-4 rounded-full",
                item.hvamyn === "Y" ? "bg-primary" : "bg-gray-300"
              )}
            />{" "}
            <span
              className={tw(
                item.hvamyn === "Y" ? "text-primary" : "text-gray-500"
              )}
            >
              {item.hvamyn === "Y" ? "가능" : "불가"}
            </span>
          </div>
        </div>
      </Link>

      {/* 지도 보기, 전화 걸기 */}
      <div className="flex gap-2 items-center justify-end">
        <a
          className="w-1/2 h-11 bg-secondary text-white rounded-md flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => handleMapClick(item.dutyName)}
        >
          <BiSolidMapPin />
          지도 보기
        </a>

        <Link
          to={`/call/${item.hpid}?name=${encodeURIComponent(
            item.dutyName
          )}&tel=${encodeURIComponent(item.dutyTel3)}`}
          state={{
            name: item.dutyName,
            tel: item.dutyTel3,
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="w-1/2 h-11 bg-primary text-white rounded-md flex items-center justify-center gap-2"
        >
          <BiPhone />
          전화 걸기
        </Link>
      </div>
    </li>
  );
}
export default ERItem;
