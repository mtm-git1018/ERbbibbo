import { useGetHospitalMessage, type HospitolMessage } from "@/domain/er-status/api/useGetHospitalMessage";
import DetailStatusItem from "@/domain/er-status/components/detail/DetailStatusItem";
import { useLocation, useSearchParams } from "react-router";





function Detail() {
  const location = useLocation()
  const [searchParams] = useSearchParams();
  const stage1 = searchParams.get("stage1") as string;
  const stage2 = searchParams.get("stage2") as string;
  const hpid = location.state.item.hpid
  const qn = location.state.item.dutyName
  const { data, isLoading,isFetching, error } = useGetHospitalMessage(hpid,qn,stage1,stage2);

   if (isLoading || isFetching) return <div>로딩중...</div>;
   if (error) return <div>에러 발생: {error.message}</div>;
  const lat = data?.map((v) => v.wgs84Lat).join('')
  const long = data?.map((v) => v.wgs84Lon).join('')

  return (
    <div className="max-w-375">
      <section className="py-5 border-b border-gray-300">
        <DetailStatusItem lat={ lat } lon={long} />
      </section>
      <section className="py-5">
        <h2 className="text-xl font-bold">응급실 메세지</h2>
        <ul className="flex flex-col gap-2 pt-3">
          {data && data.length > 0 ? (
            data.map((item: HospitolMessage,i) => {
              return item.symTypCod == "Y000" ? (
                <li
                  key={item.rnum}
                  className="px-3 py-2 rounded-sm bg-gray-200 text-sm "
                >
                  {item.symBlkMsg}
                </li>
              ) : (
                  <li key={i}>응급실 메시지가 없습니다.</li>
              );
            })
          ) : (
            <li>응급실 메시지가 없습니다.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
export default Detail