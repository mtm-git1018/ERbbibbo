
import { MdPhone } from "react-icons/md";

function Call() {
  return (
    <div className="flex flex-col justify-between items-center min-h-full py-5">
      <h1 className="text-2xl font-bold">병원명</h1>
      <section className="flex flex-col items-center gap-6">
        <p className="text-3xl font-bold">010-4000-0000</p>
        <div className="text-primary">
          <MdPhone size={133} />
        </div>
        <p className="text-center">병원 응급실로 연결합니다.</p>
      </section>
      <section className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-40 h-11 bg-primary rounded-xl text-white font-bold"
          >
            환자 수용됨
          </button>
          <button
            type="submit"
            className="w-40 h-11 bg-secondary rounded-xl text-white font-bold"
          >
            거절됨
          </button>
        </div>
        <p className="text-gray-500 text-xs">
          응급삐뽀는 특정 병원의 거절율을 수집하지 않습니다.
        </p>
      </section>
    </div>
  );
}
export default Call