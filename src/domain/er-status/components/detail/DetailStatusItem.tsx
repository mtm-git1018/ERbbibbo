import { useLocation } from "react-router";
import ERItem from "../ERItem";

function DetailStatusItem() {
    const location = useLocation();
  
    const { item } = location.state || {};

    if (!item) {
      return <div>데이터가 없습니다.</div>;
    }

  return (
    <ERItem item={item}></ERItem>
  )
}
export default DetailStatusItem