import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";

// XML 파서 설정
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: true,
  parseTagValue: true,
});

export interface HospitolMessage {
  dutyAddr: string; // 기관 주소
  dutyName: string; // 기관명
  emcOrgCod: string; // 기관코드
  hpid: string; // 기관코드
  rnum: number; // 일련번호
  symBlkEndDtm: number; // 차단해제
  symBlkMsg: string; //전달 메시지
  symBlkMsgTyp: string; //메시지 구분
  symBlkSttDtm: number; // 차단 시작
  symOutDspMth: string; // 표출차단구분
  symOutDspYon: string; // 중증질환 차단 구분
  symTypCod: string; // 중증질환코드
  symTypCodMag: string; //중증질환명
  wgs84Lat: string;
  wgs84Lon: string;
}

const fetchMessagefromHospital = async(hpid:string,qn:string,q0:string,q1:string):Promise<HospitolMessage[]>  => {
  const apiKey = import.meta.env.VITE_PUBLIC_DATA_API_KEY;

 
  const baseUrl =
    "http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytBassInfoInqire";

  
    const params = new URLSearchParams({
      serviceKey: apiKey,
      pageNo: "1",
      numOfRows: "10",
      HPID: hpid,
      QN:qn,
      Q0: q0 || "서울특별시",
      Q1: q1,
    });

  const response = await fetch(`${baseUrl}?${params.toString()}`);
  const xmlText = await response.text();
  const jsonData = parser.parse(xmlText);

  const items = jsonData?.response?.body?.items?.item || [];

  // 배열이 아닌 경우 배열로 변환
  return Array.isArray(items) ? items : [items];
}

export const useGetHospitalMessage = (hpid:string,qn:string,stage1:string,stage2:string) => {
  return useQuery({
    queryKey: ["hospitalMessage"],
    queryFn: () =>
      fetchMessagefromHospital(
        hpid,
        qn,
        stage1,
        stage2
      ),
    placeholderData:keepPreviousData,
    staleTime: 0, // 5분간 캐시 유지
    refetchInterval: 10 * 60 * 1000, // 10분마다 자동 갱신
  });
};
