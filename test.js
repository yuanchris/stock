let start = 20110101;
let end = 20110201;
while (end < 20130701) {
  start = end;
  if (end % 10000 !== 1201) {
    end += 100;
  } else {
    end += 8900;
  }
  console.log(start, ' ', end);
}