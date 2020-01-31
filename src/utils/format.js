export const formatTime = time => {
  const convertedDate = new Date(time);
  const yyyy = convertedDate.getFullYear();
  const mm = `0${convertedDate.getMonth() + 1}`.slice(-2);
  const dd = `0${convertedDate.getDate()}`.slice(-2);
  const hh = `0${convertedDate.getHours()}`.slice(-2);
  const min = `0${convertedDate.getMinutes()}`.slice(-2);
  const sec = `0${convertedDate.getSeconds()}`.slice(-2);
  return `${yyyy}/${mm}/${dd} ${hh}:${min}:${sec}`;
};
