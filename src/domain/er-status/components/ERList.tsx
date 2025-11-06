import { useSearchParams } from "react-router";
import { useGetRltmInfoInqire } from "../api/useGetRltmInfoInqire";
import ERItem from "./ERItem";
import { useGetHospitalLocationsByHpids } from "../api/useGetHospitalLocationByHpid";
import { sortByDistance, type Coordinates } from "@/shared/utils/distance";
import { useEffect, useState } from "react";

function ERList() {
  const [searchParams] = useSearchParams();
  const stage1 = searchParams.get("stage1") as string;
  const stage2 = searchParams.get("stage2") as string;
  const { data, isLoading, error } = useGetRltmInfoInqire(stage1, stage2);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });
    });
  }, []);

  const {
    data: hospitalLocation,
    isLoading: hospitalLocationLoading,
    error: hospitalLocationError,
  } = useGetHospitalLocationsByHpids(data?.map((item) => item.hpid) || []);

  if (isLoading || hospitalLocationLoading) return <div>로딩중...</div>;
  if (error || hospitalLocationError)
    return (
      <div>에러 발생: {error?.message || hospitalLocationError?.message}</div>
    );
  if (!data) return <div>데이터가 없습니다.</div>;
  if (!userLocation) return <div>위치 정보를 가져오는 중입니다.</div>;

  const conbinedData = data.map((item) => {
    const location = hospitalLocation?.find(
      (location) => location.hpid === item.hpid
    );
    return {
      ...item,
      created_at: location?.created_at,
      dutyAddr: location?.dutyAddr,
      dutyDiv: location?.dutyDiv,
      endTime: location?.endTime,
      startTime: location?.startTime,
      latitude: parseFloat(location?.latitude || "0"),
      longitude: parseFloat(location?.longitude || "0"),
    };
  });

  const sortedData = sortByDistance(userLocation, conbinedData);

  return (
    <ul className="flex flex-col gap-8">
      {sortedData.map((item, index) => (
        <ERItem key={index} item={item} first={index === 0} />
      ))}
    </ul>
  );
}
export default ERList;
