
import { useEffect } from "react";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const { kakao } = window;

interface Props {
  lat: string | undefined;
  lon: string | undefined;
}

function KakaoMap({ lat, lon }: Props) {
  useEffect(() => {
    const container = document.getElementById("map");
    const markerPosition = new kakao.maps.LatLng(lat, lon);
    const marker = {
      position: markerPosition,
    };
    const options = {
      center: new kakao.maps.LatLng(lat, lon),
      level: 4,
      marker: marker,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const map = new kakao.maps.StaticMap(container, options);
  }, []);

  return <div id="map" style={{ width: "400px", height: "400px" }}></div>;
}
export default KakaoMap;
