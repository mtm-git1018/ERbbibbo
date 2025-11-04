import { useGetHospitalMessage, type HospitolMessage } from "@/domain/er-status/api/useGetHospitalMessage";
import DetailStatusItem from "@/domain/er-status/components/detail/DetailStatusItem";




function Detail() {
    const { data, isLoading, error } = useGetHospitalMessage();

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생: {error.message}</div>;


  return (
    <div className="max-w-375">
      <section className="mt-5">
        <DetailStatusItem/>
      </section>
      <section className="mt-5">
        <h2 className="text-xl font-bold">응급실 메세지</h2>
        <ul className="flex flex-col gap-2 pt-3">
          {data &&
            data.map((item: HospitolMessage) => {
              return (
                item.symTypCod == "Y000" && (
                  <li
                    key={item.rnum}
                    className="px-3 py-2 rounded-sm bg-gray-200 text-sm "
                  >
                    {item.symBlkMsg}
                  </li>
                )
              );
            })}
        </ul>
      </section>
    </div>
  );
}
export default Detail