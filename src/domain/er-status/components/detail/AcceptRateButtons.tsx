import supabase from "@/shared/@types/createSupabase";

function AcceptRateButtons() {

  const handleAccept = async() => {
    const { error } = await supabase.from('er_accepted').insert({
      created_at:new Date().toISOString(),
      accept:true,
    })
    if (error) {
      console.error(error) 
      return
    }

    alert('환자 수용이 완료되었습니다.')
    window.close()
  }

  const handleDenied = async () => {
    const { error } = await supabase.from('er_denied').insert({
      created_at:new Date().toISOString(),
      accept:false
    })
    if (error) {
      console.error(error) 
      return
    }
    
    alert("환자 수용이 거절되었습니다.");
    window.close();
  }

  return (
    <>
      <div className="flex gap-4">
        <button
          type="submit"
          className="w-40 h-11 bg-primary rounded-xl text-white font-bold duration-200 hover:bg-[#2A9A46] focus:bg-[#2A9A46]"
          onClick={handleAccept}
        >
          환자 수용됨
        </button>
        <button
          type="submit"
          className="w-40 h-11 bg-secondary rounded-xl text-white font-bold duration-200 hover:bg-[#AE333B] focus:bg-[#AE333B]"
          onClick={handleDenied}
        >
          거절됨
        </button>
      </div>
      <p className="text-gray-500 text-xs">
        응급삐뽀는 특정 병원의 거절율을 수집하지 않습니다.
      </p>
    </>
  );
}
export default AcceptRateButtons