import { Outlet } from "react-router";

function Root() {
  return (
    <main className="page-layout max-w-375">
      <Outlet />
    </main>
  );
}
export default Root;
