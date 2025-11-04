import clsx from "clsx";

interface Props{
  title: string,
  active:boolean
}

function TabButton({ title,active=false }: Props) {
  return (
    <button
      className={clsx(
        "h-7 px-5 py-1 rounded-full",
        active ? "bg-secondary" : "border-0.5 border-gray-400"
      )}
    >
      {title}
    </button>
  );
}
export default TabButton