import { useLocation } from "react-router";
import ERItem from "../ERItem";
import KakaoMap from "@/domain/er-status/components/detail/KakaoMap";

interface Props {
  lat: string |undefined,
  lon:string | undefined
}

function DetailStatusItem({ lat,lon}:Props) {
  const location = useLocation();
  const { item } = location.state || {};
    if (!item) {
      return <div>데이터가 없습니다.</div>;
  }
  
 
  return (
    <>
      <ERItem item={item} />
      <section className="pt-3 flex-center rounded-lg">
        <KakaoMap lat={ lat } lon={lon} />
      </section>
    </>
  );
}
export default DetailStatusItem