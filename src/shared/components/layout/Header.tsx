import Logo from "@/shared/assets/icons/logo.svg";
import { Link } from "react-router";

function Header() {
  return (
    <header className="flex justify-between items-center h-10 bg-bg px-5 py-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)] ">
      <Link to="/">
        <h1 className="flex gap-1 items-center cursor-pointer">
          <div className="h-6 w-7">
            <img src={Logo} alt="응급삐뽀 로고" />
          </div>
          <p className="font-jalnan font-bold">
            응급<span className="text-secondary">삐뽀</span>
          </p>
        </h1>
      </Link>

      <button type="button">전체 거절율</button>
    </header>
  );
}
export default Header;
