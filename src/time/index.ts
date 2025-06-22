export const TZ_OFFSET_IN_SECONDS = new Date().getTimezoneOffset() * 60;

export const getTime = () => {
  const local = new Date(Date.now() - TZ_OFFSET_IN_SECONDS);
  const utc = new Date();

  return {
    local: {
      yyyyMmDd: Intl.DateTimeFormat("en-CA").format(local),
      iso: local.toISOString(),
      millis: local.getTime(),
      seconds: local.getTime() / 1000,
    },
    utc: {
      yyyyMmDd: Intl.DateTimeFormat("en-CA").format(utc),
      iso: utc.toISOString(),
      millis: utc.getTime(),
      seconds: utc.getTime() / 1000,
    },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};
