export const getNowAsYyyyMmDd = () =>
  new Intl.DateTimeFormat("en-CA").format(new Date());

export const getNowAsMillis = () => Date.now().toString();

export const getNowAsSeconds = () => Date.now() / 1_000;
