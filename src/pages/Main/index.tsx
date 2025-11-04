import { useGetRltmInfoInqire, type EmergencyRoomInfo } from "../../domain/er-status/api/useGetRltmInfoInqire";

function Main() {
  const { data, isLoading, error } = useGetRltmInfoInqire();

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  console.log(data);

  return (
    <div>
      {data?.map((item: EmergencyRoomInfo) => (
        <div key={item.hpid}>{item.dutyName}</div>
      ))}
    </div>
  );
}

export default Main;