function getDate(date) {
  const fullDate = new Date(date * 1000);
  const yy = fullDate.getFullYear();
  const mm = fullDate.getMonth() + 1 <= 9 ? `0${fullDate.getMonth() + 1}` : fullDate.getMonth() + 1;
  const dd = fullDate.getDate() < 10 ? (`0${fullDate.getDate()}`) : fullDate.getDate();
  const today = `${yy}-${mm}-${dd}`;
  return today;
}
module.exports = { getDate };
