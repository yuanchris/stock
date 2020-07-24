


function getDate(date) {
  const fullDate = new Date(date * 1000);
  const yy = fullDate.getFullYear();
  const mm = fullDate.getMonth() + 1 <= 9 ? `0${fullDate.getMonth() + 1}` : fullDate.getMonth() + 1;
  const dd = fullDate.getDate() < 10 ? (`0${fullDate.getDate()}`) : fullDate.getDate();
  const today = `${yy}-${mm}-${dd}`;
  return today;
}

const wrapAsync = (fn) => {
  return function(req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};
module.exports = { getDate, wrapAsync};
