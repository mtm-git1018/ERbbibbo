/**
 * 위경도 좌표 타입 정의
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * 두 지점 간의 직선거리를 계산하는 함수 (Haversine 공식 사용)
 *
 * @param coord1 첫 번째 좌표 (사용자 위치)
 * @param coord2 두 번째 좌표 (목표 위치)
 * @returns 두 지점 간의 거리 (킬로미터 단위)
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // 지구의 반지름 (킬로미터)

  // 위도와 경도를 라디안으로 변환
  const lat1Rad = toRadians(coord1.latitude);
  const lat2Rad = toRadians(coord2.latitude);
  const deltaLatRad = toRadians(coord2.latitude - coord1.latitude);
  const deltaLonRad = toRadians(coord2.longitude - coord1.longitude);

  // Haversine 공식
  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 두 지점 간의 직선거리를 계산하는 함수 (간단한 유클리드 거리)
 * 짧은 거리에서 빠른 계산이 필요한 경우 사용
 *
 * @param coord1 첫 번째 좌표
 * @param coord2 두 번째 좌표
 * @returns 두 지점 간의 대략적인 거리 (킬로미터 단위)
 */
export function calculateSimpleDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const latDiff = coord2.latitude - coord1.latitude;
  const lonDiff = coord2.longitude - coord1.longitude;

  // 위도 1도 ≈ 111km, 경도는 위도에 따라 달라짐
  const latDistance = latDiff * 111;
  const lonDistance = lonDiff * 111 * Math.cos(toRadians(coord1.latitude));

  return Math.sqrt(latDistance * latDistance + lonDistance * lonDistance);
}

/**
 * 거리에 따른 표시 형식을 반환하는 함수
 *
 * @param distance 거리 (킬로미터 단위)
 * @returns 포맷된 거리 문자열
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
}

/**
 * 좌표 배열을 거리순으로 정렬하는 함수
 *
 * @param userLocation 사용자 위치
 * @param locations 정렬할 위치 배열 (각 객체는 coordinates 속성을 가져야 함)
 * @returns 거리순으로 정렬된 배열
 */
export function sortByDistance<
  T extends { latitude: number; longitude: number }
>(userLocation: Coordinates, locations: T[]): (T & { distance: number })[] {
  return locations
    .map((location) => ({
      ...location,
      distance: calculateDistance(userLocation, {
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * 특정 반경 내의 위치들만 필터링하는 함수
 *
 * @param userLocation 사용자 위치
 * @param locations 필터링할 위치 배열
 * @param radiusKm 반경 (킬로미터)
 * @returns 반경 내의 위치들
 */
export function filterByRadius<T extends { latitude: number, longitude: number }>(
  userLocation: Coordinates,
  locations: T[],
  radiusKm: number
): T[] {
  return locations.filter(
    (location) =>
      calculateDistance(userLocation, {latitude: location.latitude, longitude: location.longitude}) <= radiusKm
  );
}

/**
 * 가장 가까운 N개의 위치를 반환하는 함수
 *
 * @param userLocation 사용자 위치
 * @param locations 검색할 위치 배열
 * @param count 반환할 개수
 * @returns 가장 가까운 N개의 위치
 */
export function findNearestLocations<T extends { latitude: number, longitude: number }>(
  userLocation: Coordinates,
  locations: T[],
  count: number
): (T & { distance: number })[] {
  return sortByDistance(userLocation, locations).slice(0, count);
}

/**
 * 도를 라디안으로 변환하는 헬퍼 함수
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 라디안을 도로 변환하는 헬퍼 함수
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * 두 좌표가 유효한지 검증하는 함수
 */
export function isValidCoordinates(coord: Coordinates): boolean {
  return (
    typeof coord.latitude === "number" &&
    typeof coord.longitude === "number" &&
    coord.latitude >= -90 &&
    coord.latitude <= 90 &&
    coord.longitude >= -180 &&
    coord.longitude <= 180 &&
    !isNaN(coord.latitude) &&
    !isNaN(coord.longitude)
  );
}

/**
 * 문자열 좌표를 숫자로 변환하는 함수
 */
export function parseCoordinates(
  lat: string | number,
  lon: string | number
): Coordinates | null {
  const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
  const longitude = typeof lon === "string" ? parseFloat(lon) : lon;

  const coord = { latitude, longitude };

  return isValidCoordinates(coord) ? coord : null;
}
