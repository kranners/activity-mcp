export const getNow = () => {
  return {
    yyyyMmDd: Intl.DateTimeFormat("en-CA").format(new Date()),
    iso: new Date().toISOString(),
    millis: Date.now().toString(),
    seconds: Date.now() / 1000,
  };
};
