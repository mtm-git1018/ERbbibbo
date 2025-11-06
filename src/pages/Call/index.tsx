
import AcceptRateButtons from "@/domain/er-status/components/detail/AcceptRateButtons";
import { useEffect } from "react";
import { MdPhone } from "react-icons/md";
import { useSearchParams} from "react-router";


function Call() {
  const [searchParams] = useSearchParams()

  const name = searchParams.get('name')
  const tel = searchParams.get('tel')

  useEffect(() => {
    if (tel) {
      window.location.href = `tel:${tel}`
    }
  }, [tel])
  
  return (
    <div className="flex flex-col justify-between items-center min-h-full py-5">
      <h1 className="text-2xl font-bold">{name}</h1>
      <section className="flex flex-col items-center gap-6">
        <p className="text-3xl font-bold">{tel}</p>
        <div className="text-primary">
          <MdPhone size={133} />
        </div>
        <p className="text-center">병원 응급실로 연결합니다.</p>
      </section>
      <section className="flex flex-col items-center gap-4">
        <AcceptRateButtons />
      </section>
    </div>
  );
}
export default Call