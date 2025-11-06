import { useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: true,
  parseTagValue: true,
});

interface HospitalLocation {
  wgs84Lat: string;
  wgs84Lon:string
}

const fetchHospitalLocation = async (hpid:string):Promise<HospitalLocation[]> => {
  const apiKey = import.meta.env.VITE_PUBLIC_DATA_API_KEY;
  const baseUrl =
    "http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytBassInfoInqire";
  
      const params = new URLSearchParams({
        serviceKey: apiKey,
        pageNo: "1",
        numOfRows: "10",
        HPID:hpid
      });
  
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const xmlText = await response.text();
    const jsonData = parser.parse(xmlText);

    const items = jsonData?.response?.body?.items?.item || [];

    // 배열이 아닌 경우 배열로 변환
    return Array.isArray(items) ? items : [items];
}

export const useGetHospitalLocation = (hpid:string) => {
  return useQuery({
    queryKey: ["hospitalLocation"],
    queryFn: () => fetchHospitalLocation(hpid),
    staleTime: 0, // 5분간 캐시 유지
    refetchInterval: 10 * 60 * 1000, // 10분마다 자동 갱신
  });
};
