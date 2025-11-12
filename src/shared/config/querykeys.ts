export const queryKeys = {
  rltmInfoInqire: (stage1: string, stage2?: string) => [
    "rltmInfoInqire",
    stage1,
    stage2 ?? "",
  ],
  hospitalLocation: (hpid: string) => ["hospitalLocation", hpid],
};
