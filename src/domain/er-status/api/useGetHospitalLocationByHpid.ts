import { queryKeys } from "@/shared/config/querykeys";
import supabase from "@/shared/config/supabase";
import { useQuery } from "@tanstack/react-query";

// 단일 hpid 조회 (기존 호환성 유지)
const getHospitalLocationByHpid = async (hpid: string) => {
  const { data, error } = await supabase
    .from("hospital_locations")
    .select("*")
    .eq("hpid", hpid);

  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Hospital location not found");
  }
  return data;
};

// 다중 hpid 조회 (새로 추가)
const getHospitalLocationsByHpids = async (hpids: string[]) => {
  if (!hpids.length) return [];
  
  const { data, error } = await supabase
    .from("hospital_locations")
    .select("*")
    .in("hpid", hpids);

  if (error) {
    throw error;
  }
  return data || [];
};

// 단일 hpid용 훅 (기존 호환성 유지)
export const useGetHospitalLocationByHpid = (hpid: string) => {
  return useQuery({
    queryKey: queryKeys.hospitalLocation(hpid),
    queryFn: () => getHospitalLocationByHpid(hpid),
    enabled: !!hpid,
  });
};

// 다중 hpid용 훅 (새로 추가)
export const useGetHospitalLocationsByHpids = (hpids: string[]) => {
  return useQuery({
    queryKey: ["hospitalLocations", ...hpids.sort()], // 정렬해서 캐시 키 일관성 유지
    queryFn: () => getHospitalLocationsByHpids(hpids),
    enabled: hpids.length > 0,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지 (위치 정보는 자주 변하지 않음)
  });
};