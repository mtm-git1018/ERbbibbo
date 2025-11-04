function statusItem({
  cur,
  max,
  name,
}: {
  cur: number;
  max: number;
  name: string;
  available?: number;
}) {
  const percentage = Math.min(cur / max, 1); // 100%를 넘지 않도록 제한

  // 원의 기본 설정
  const radius = 24; // 원의 반지름
  const strokeWidth = 4; // 테두리 두께
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI; // 원의 둘레

  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - percentage * circumference;

  // 색상 결정
  const strokeColor =
    percentage > 0.8
      ? "#ef4444" // 80% 이상 빨강
      : percentage > 0.6
      ? "#f59e0b" // 60% 이상 주황
      : "#10b981"; // 60% 미만 초록

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm text-gray-500">{name}</div>

      {/* 원형 진행률 표시 */}
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* 배경 원 */}
          <circle
            stroke="#e5e7eb" // 회색 배경
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* 진행률 원 */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" // 끝부분을 둥글게
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-300 ease-in-out" // 애니메이션 효과
          />
        </svg>

        {/* 가운데 퍼센트 표시 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {Math.round(percentage * 100)}%
          </span>
        </div>
      </div>

        <div className="text-sm text-gray-500">
          {`${cur} / ${max}`}
        </div>
    </div>
  );
}
export default statusItem;
