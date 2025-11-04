import { useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";

// XML 파서 설정
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: true,
  parseTagValue: true,
});

// 응급실 정보 타입 정의
export interface EmergencyRoomInfo {
  dutyName: string; // 병원명
  dutyTel3: string; // 응급실 전화번호
  hpid: string; // 병원 ID
  hvec: number; // 응급실 가용 병상 수
  hvicc: number; // 중환자실 가용 병상 수
  hvgc: number; // 일반 병상 수
  hvoc: number; // 수술실 가용 수
  hvncc: number; // 신생아 중환자실
  hvidate: string; // 업데이트 시간
  hvctayn: string; // CT 가용 여부 (Y/N)
  hvmriayn: string; // MRI 가용 여부 (Y/N)
  hvangioayn: string; // 혈관촬영기 가용 여부 (Y/N)
  hvamyn: string; // 구급차 가용 여부 (Y/N)
}

const fetchEmergencyRoomData = async (STAGE1: string, STAGE2: string): Promise<EmergencyRoomInfo[]> => {
    const apiKey = encodeURIComponent(
      "b26488efed9653925c32b62a4b6dde584893ef168f6f81a8dd985ea75fc39686"
    );
  const baseUrl =
    "http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire";

  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: "1",
    numOfRows: "100",
    STAGE1: STAGE1 || "서울특별시",
    STAGE2: STAGE2,
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const xmlText = await response.text();
  const jsonData = parser.parse(xmlText);

  const items = jsonData?.response?.body?.items?.item || [];

  // 배열이 아닌 경우 배열로 변환
  return Array.isArray(items) ? items : [items];
};

export const useGetRltmInfoInqire = () => {
  return useQuery({
    queryKey: ["rltmInfoInqire"],
    queryFn: () => fetchEmergencyRoomData("서울특별시", "강남구"),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchInterval: 10 * 60 * 1000, // 10분마다 자동 갱신
  });
};
