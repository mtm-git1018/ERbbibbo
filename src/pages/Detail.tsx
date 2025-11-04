import ERmessage from "../domain/detail/ERmessage"

function Detail() {
  return (
    <div>
      {/* 현황판 컴포넌트 자리 */}
      <section className="mt-5">
        <ERmessage />
      </section>
    </div>
  );
}
export default Detail