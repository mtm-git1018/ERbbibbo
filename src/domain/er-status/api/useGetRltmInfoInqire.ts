import { queryKeys } from "@/shared/config/querykeys";
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

export interface EmergencyRoomInfo {
  dutyName: string;
  dutyTel3: string;
  hpid: string;

  // 가용 병상 (음수 가능 - 대기환자 존재)
  hvec: number; // 응급실 가용 병상
  hvicc: number; // 중환자실 가용 병상
  hvgc: number; // 일반 병상 가용
  hvoc: number; // 수술실 가용
  hvncc: number; // 신생아 중환자실 가용
  hv2: number; // 소아응급실 가용
  hv3: number; // 분만실 가용
  hv30: number; // 격리실 가용

  // 전체 병상 (hvs 필드들)
  hvs01: number; // 전체 응급실 병상
  hvs02: number; // 소아응급실 병상
  hvs03: number; // 분만실 병상
  hvs04: number; // 격리실 병상
  hvs30: number; // 전체 일반 병상
  hvs31: number; // 전체 중환자실 병상
  hvs32: number; // 전체 수술실 병상
  hvs33: number; // 전체 신생아 중환자실 병상

  // 기타 필요한 필드들
  hvidate: number;
  hvctayn: string;
  hvmriayn: string;
  hvangioayn: string;
  hvamyn: string;

  // 계산된 필드들
  emergencyUsage?: string;
  emergencyStatus?: "available" | "busy" | "full" | "overflow";
  icuUsage?: string;
  generalUsage?: string;
}

const fetchEmergencyRoomData = async (
  STAGE1: string,
  STAGE2: string
): Promise<EmergencyRoomInfo[]> => {
  const apiKey = 
    "b26488efed9653925c32b62a4b6dde584893ef168f6f81a8dd985ea75fc39686"

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

export const useGetRltmInfoInqire = (STAGE1: string, STAGE2: string) => {
  return useQuery({
    queryKey: queryKeys.rltmInfoInqire(STAGE1, STAGE2),
    queryFn: () => fetchEmergencyRoomData(STAGE1, STAGE2),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchInterval: 10 * 60 * 1000, // 10분마다 자동 갱신
    enabled: !!STAGE1,
  });
};
