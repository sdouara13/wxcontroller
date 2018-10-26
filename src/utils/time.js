export default (time) => {
  if (!time) {
    time = 3600 * 24 * 1000;
  }
  return new Date().getTime() + time;
}
