import { Outlet } from "react-router";
import Header from "../../shared/components/layout/Header";

function Root() {
  return (
    <div className="flex flex-col h-dvh">
      <Header />
      <main className="page-layout responsive-container">
        <Outlet />
      </main>
    </div>
  );
}
export default Root;
