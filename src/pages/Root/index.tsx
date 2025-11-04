import { Outlet } from "react-router";
import Header from "../../shared/components/layout/Header";

function Root() {
  return (
    <>
      <Header />
      <main className="page-layout max-w-375">
        <Outlet />
      </main>
    </>
  );
}
export default Root;
