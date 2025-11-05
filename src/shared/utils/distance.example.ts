/**
 * 거리 계산 유틸리티 함수 사용 예시
 */

import {
  calculateDistance,
  calculateSimpleDistance,
  formatDistance,
  sortByDistance,
  filterByRadius,
  findNearestLocations,
  parseCoordinates,
  isValidCoordinates,
  type Coordinates
} from './distance';

// 예시 데이터: 서울 지역 병원들
const hospitals = [
  {
    id: 'A0000001',
    name: '서울대학교병원',
    coordinates: { latitude: 37.5799, longitude: 126.9988 }
  },
  {
    id: 'A0000002', 
    name: '삼성서울병원',
    coordinates: { latitude: 37.4881, longitude: 127.0856 }
  },
  {
    id: 'A0000003',
    name: '세브란스병원',
    coordinates: { latitude: 37.5626, longitude: 126.9397 }
  },
  {
    id: 'A0000004',
    name: '서울아산병원',
    coordinates: { latitude: 37.5265, longitude: 127.1086 }
  }
];

// 사용자 위치 (예: 강남역)
const userLocation: Coordinates = {
  latitude: 37.4979, 
  longitude: 127.0276
};

console.log('=== 거리 계산 유틸리티 사용 예시 ===\n');

// 1. 기본 거리 계산
console.log('1. 기본 거리 계산');
hospitals.forEach(hospital => {
  const distance = calculateDistance(userLocation, hospital.coordinates);
  const formattedDistance = formatDistance(distance);
  console.log(`${hospital.name}: ${formattedDistance}`);
});

console.log('\n2. 간단한 거리 계산 (빠른 계산용)');
hospitals.forEach(hospital => {
  const distance = calculateSimpleDistance(userLocation, hospital.coordinates);
  const formattedDistance = formatDistance(distance);
  console.log(`${hospital.name}: ${formattedDistance}`);
});

// 3. 거리순 정렬
console.log('\n3. 거리순 정렬');
const sortedHospitals = sortByDistance(userLocation, hospitals);
sortedHospitals.forEach((hospital, index) => {
  console.log(`${index + 1}. ${hospital.name}: ${formatDistance(hospital.distance)}`);
});

// 4. 반경 내 병원 필터링 (5km 이내)
console.log('\n4. 5km 이내 병원 필터링');
const nearbyHospitals = filterByRadius(userLocation, hospitals, 5);
console.log(`5km 이내 병원: ${nearbyHospitals.length}개`);
nearbyHospitals.forEach(hospital => {
  const distance = calculateDistance(userLocation, hospital.coordinates);
  console.log(`- ${hospital.name}: ${formatDistance(distance)}`);
});

// 5. 가장 가까운 2개 병원
console.log('\n5. 가장 가까운 2개 병원');
const nearest2 = findNearestLocations(userLocation, hospitals, 2);
nearest2.forEach((hospital, index) => {
  console.log(`${index + 1}. ${hospital.name}: ${formatDistance(hospital.distance)}`);
});

// 6. 좌표 유효성 검증
console.log('\n6. 좌표 유효성 검증');
const validCoord = { latitude: 37.5665, longitude: 126.9780 };
const invalidCoord = { latitude: 200, longitude: 300 };

console.log(`유효한 좌표 (서울시청): ${isValidCoordinates(validCoord)}`);
console.log(`잘못된 좌표: ${isValidCoordinates(invalidCoord)}`);

// 7. 문자열 좌표 파싱
console.log('\n7. 문자열 좌표 파싱');
const parsedCoord = parseCoordinates('37.5665', '126.9780');
console.log('파싱된 좌표:', parsedCoord);

const invalidParsed = parseCoordinates('invalid', 'coordinates');
console.log('잘못된 좌표 파싱:', invalidParsed);

// 8. 실제 사용 예시: 응급실 검색 결과 정렬
console.log('\n8. 실제 사용 예시: 응급실 검색 결과 정렬');

interface EmergencyRoom {
  hpid: string;
  dutyName: string;
  dutyAddr: string;
  coordinates: Coordinates;
  availableBeds: number;
}

const emergencyRooms: EmergencyRoom[] = [
  {
    hpid: 'A0000001',
    dutyName: '서울대학교병원 응급의료센터',
    dutyAddr: '서울특별시 종로구 대학로 101',
    coordinates: { latitude: 37.5799, longitude: 126.9988 },
    availableBeds: 5
  },
  {
    hpid: 'A0000002',
    dutyName: '삼성서울병원 응급의료센터', 
    dutyAddr: '서울특별시 강남구 일원로 81',
    coordinates: { latitude: 37.4881, longitude: 127.0856 },
    availableBeds: 3
  }
];

// 거리순으로 정렬하고 거리 정보 추가
const sortedERs = sortByDistance(userLocation, emergencyRooms);

console.log('거리순 응급실 목록:');
sortedERs.forEach((er, index) => {
  console.log(`${index + 1}. ${er.dutyName}`);
  console.log(`   거리: ${formatDistance(er.distance)}`);
  console.log(`   가용 병상: ${er.availableBeds}개`);
  console.log(`   주소: ${er.dutyAddr}\n`);
});

export {
  hospitals,
  userLocation,
  emergencyRooms
};
