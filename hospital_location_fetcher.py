import requests
import csv
import json
import time
from typing import List, Dict, Optional
import urllib.parse

class HospitalLocationFetcher:
    def __init__(self, service_key: str):
        """
        응급의료기관 위치 정보를 가져오는 클래스
        
        Args:
            service_key: 공공데이터포털에서 발급받은 서비스키
        """
        self.service_key = service_key
        self.base_url = "http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytLcinfoInqire"
        self.hospitals = []
    
    def fetch_hospitals_by_location(self, longitude: float, latitude: float, 
                                  num_of_rows: int = 100, max_pages: int = 10) -> List[Dict]:
        """
        특정 좌표 기준으로 응급의료기관 정보를 가져옵니다.
        
        Args:
            longitude: 경도
            latitude: 위도
            num_of_rows: 페이지당 조회 건수
            max_pages: 최대 페이지 수
        
        Returns:
            병원 정보 리스트
        """
        hospitals = []
        page_no = 1
        
        while page_no <= max_pages:
            params = {
                'serviceKey': self.service_key,
                'WGS84_LON': longitude,
                'WGS84_LAT': latitude,
                'pageNo': page_no,
                'numOfRows': num_of_rows,
                '_type': 'json'
            }
            
            try:
                print(f"페이지 {page_no} 요청 중... (좌표: {latitude}, {longitude})")
                response = requests.get(self.base_url, params=params, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                
                # API 응답 구조 확인
                if 'response' not in data:
                    print(f"예상치 못한 응답 구조: {data}")
                    break
                
                response_data = data['response']
                
                # 결과 코드 확인
                if response_data.get('header', {}).get('resultCode') != '00':
                    print(f"API 오류: {response_data.get('header', {})}")
                    break
                
                # body가 없거나 items가 없으면 종료
                body = response_data.get('body')
                if not body or 'items' not in body:
                    print(f"더 이상 데이터가 없습니다. (페이지: {page_no})")
                    break
                
                items = body['items']
                if not items or (isinstance(items, dict) and 'item' not in items):
                    print(f"더 이상 데이터가 없습니다. (페이지: {page_no})")
                    break
                
                # items가 dict인 경우 item 키에서 실제 데이터 추출
                if isinstance(items, dict):
                    items = items.get('item', [])
                
                # 단일 항목인 경우 리스트로 변환
                if isinstance(items, dict):
                    items = [items]
                
                if not items:
                    print(f"더 이상 데이터가 없습니다. (페이지: {page_no})")
                    break
                
                hospitals.extend(items)
                print(f"페이지 {page_no}: {len(items)}개 병원 정보 수집")
                
                # 다음 페이지가 없으면 종료
                if len(items) < num_of_rows:
                    print("마지막 페이지에 도달했습니다.")
                    break
                
                page_no += 1
                time.sleep(0.1)  # API 호출 간격 조절
                
            except requests.exceptions.RequestException as e:
                print(f"API 요청 오류 (페이지 {page_no}): {e}")
                break
            except json.JSONDecodeError as e:
                print(f"JSON 파싱 오류 (페이지 {page_no}): {e}")
                break
            except Exception as e:
                print(f"예상치 못한 오류 (페이지 {page_no}): {e}")
                break
        
        return hospitals
    
    def fetch_all_hospitals_nationwide(self) -> List[Dict]:
        """
        전국의 응급의료기관 정보를 수집합니다.
        주요 도시들의 좌표를 기준으로 검색하여 중복 제거 후 반환합니다.
        """
        # 전국 주요 도시 좌표 (위도, 경도)
        major_cities = [
            (37.5665, 126.9780),  # 서울
            (35.1796, 129.0756),  # 부산
            (35.8714, 128.6014),  # 대구
            (37.4563, 126.7052),  # 인천
            (35.1595, 126.8526),  # 광주
            (36.3504, 127.3845),  # 대전
            (35.5384, 129.3114),  # 울산
            (36.5684, 128.7294),  # 안동
            (37.8813, 127.7298),  # 춘천
            (36.4919, 127.2418),  # 청주
            (36.0190, 129.3435),  # 포항
            (35.8242, 127.1480),  # 전주
            (34.8118, 126.3922),  # 목포
            (33.4996, 126.5312),  # 제주
            (37.2636, 127.0286),  # 수원
            (35.2271, 128.6811),  # 창원
            (37.3422, 127.9183),  # 성남
            (35.5372, 129.3167),  # 울산
            (36.7956, 127.1096),  # 천안
            (37.4449, 126.6574),  # 부천
        ]
        
        all_hospitals = []
        seen_hpids = set()
        
        for i, (lat, lon) in enumerate(major_cities, 1):
            print(f"\n=== {i}/{len(major_cities)} 지역 검색 중 ===")
            hospitals = self.fetch_hospitals_by_location(lon, lat, num_of_rows=100, max_pages=20)
            
            # 중복 제거
            new_hospitals = []
            for hospital in hospitals:
                hpid = hospital.get('hpid')
                if hpid and hpid not in seen_hpids:
                    seen_hpids.add(hpid)
                    new_hospitals.append(hospital)
            
            all_hospitals.extend(new_hospitals)
            print(f"새로운 병원 {len(new_hospitals)}개 추가 (총 {len(all_hospitals)}개)")
            
            time.sleep(1)  # 지역 간 검색 간격
        
        self.hospitals = all_hospitals
        return all_hospitals
    
    def format_for_supabase(self, hospitals: List[Dict]) -> List[Dict]:
        """
        Supabase 테이블 구조에 맞게 데이터를 포맷팅합니다.
        """
        formatted_hospitals = []
        
        for hospital in hospitals:
            formatted = {
                'hpid': hospital.get('hpid', ''),
                'dutyDiv': hospital.get('dutyDiv', ''),
                'dutyAddr': hospital.get('dutyAddr', ''),
                'dutyName': hospital.get('dutyName', ''),
                'endTime': hospital.get('endTime', ''),
                'latitude': str(hospital.get('latitude', '')),
                'longitude': str(hospital.get('longitude', '')),
                'startTime': hospital.get('startTime', '')
            }
            formatted_hospitals.append(formatted)
        
        return formatted_hospitals
    
    def save_to_csv(self, hospitals: List[Dict], filename: str = 'hospital_locations.csv'):
        """
        병원 데이터를 CSV 파일로 저장합니다.
        """
        if not hospitals:
            print("저장할 데이터가 없습니다.")
            return
        
        # Supabase 테이블 구조에 맞게 포맷팅
        formatted_hospitals = self.format_for_supabase(hospitals)
        
        # CSV 헤더 (created_at은 Supabase에서 자동 생성되므로 제외)
        fieldnames = ['hpid', 'dutyDiv', 'dutyAddr', 'dutyName', 'endTime', 'latitude', 'longitude', 'startTime']
        
        try:
            with open(filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(formatted_hospitals)
            
            print(f"\n✅ CSV 파일 저장 완료: {filename}")
            print(f"총 {len(formatted_hospitals)}개 병원 정보 저장")
            
        except Exception as e:
            print(f"❌ CSV 파일 저장 오류: {e}")
    
    def print_sample_data(self, hospitals: List[Dict], count: int = 3):
        """
        샘플 데이터를 출력합니다.
        """
        if not hospitals:
            print("출력할 데이터가 없습니다.")
            return
        
        print(f"\n=== 샘플 데이터 ({min(count, len(hospitals))}개) ===")
        for i, hospital in enumerate(hospitals[:count], 1):
            print(f"\n{i}. {hospital.get('dutyName', 'N/A')}")
            print(f"   ID: {hospital.get('hpid', 'N/A')}")
            print(f"   주소: {hospital.get('dutyAddr', 'N/A')}")
            print(f"   분류: {hospital.get('dutyDivName', 'N/A')} ({hospital.get('dutyDiv', 'N/A')})")
            print(f"   좌표: {hospital.get('latitude', 'N/A')}, {hospital.get('longitude', 'N/A')}")
            print(f"   운영시간: {hospital.get('startTime', 'N/A')} - {hospital.get('endTime', 'N/A')}")


def main():
    """
    메인 실행 함수
    """
    print("🏥 전국 응급의료기관 위치 정보 수집기")
    print("=" * 50)
    
    # 서비스키 입력 (실제 사용 시 본인의 서비스키로 교체)
    service_key = input("공공데이터포털 서비스키를 입력하세요: ").strip()
    
    if not service_key:
        print("❌ 서비스키가 입력되지 않았습니다.")
        print("공공데이터포털(data.go.kr)에서 '응급의료기관 조회서비스' API 서비스키를 발급받아 사용하세요.")
        return
    
    # 데이터 수집 시작
    fetcher = HospitalLocationFetcher(service_key)
    
    print("\n🔍 전국 응급의료기관 정보 수집 시작...")
    hospitals = fetcher.fetch_all_hospitals_nationwide()
    
    if hospitals:
        print(f"\n✅ 총 {len(hospitals)}개 응급의료기관 정보 수집 완료!")
        
        # 샘플 데이터 출력
        fetcher.print_sample_data(hospitals)
        
        # CSV 파일 저장
        fetcher.save_to_csv(hospitals)
        
        print("\n📋 CSV 파일을 Supabase에 업로드하여 사용할 수 있습니다.")
        print("테이블: hospital_locations")
        
    else:
        print("❌ 데이터 수집에 실패했습니다.")
        print("서비스키나 API 상태를 확인해주세요.")


if __name__ == "__main__":
    main()
