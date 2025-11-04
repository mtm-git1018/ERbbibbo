import {useSearchParams } from "react-router";
import { useGetRltmInfoInqire } from "../api/useGetRltmInfoInqire";
import ERItem from "./ERItem";

function ERList() {
  const [searchParams] = useSearchParams();
  const stage1 = searchParams.get("stage1") as string;
  const stage2 = searchParams.get("stage2") as string;
  const { data, isLoading, error } = useGetRltmInfoInqire(stage1, stage2);
  console.log(data);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;
  console.log(data);

  return (
    <ul className="flex flex-col gap-8">
      {data.map((item, index) => (
          <ERItem key={index} item={item} first={index === 0} />
      ))}
    </ul>
  );
}
export default ERList;
