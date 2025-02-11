export function adjustColor(color, amount) {
  if (!color) return;
  let usePound = false;

  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  return (
    (usePound ? "#" : "") +
    (r > 255 ? 255 : r < 0 ? 0 : r).toString(16).padStart(2, "0") +
    (g > 255 ? 255 : g < 0 ? 0 : g).toString(16).padStart(2, "0") +
    (b > 255 ? 255 : b < 0 ? 0 : b).toString(16).padStart(2, "0")
  );
}

export function romanize(num) {
  var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export function formatMoney(number) {
  return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


export const dateFormat = (dateInMiliSec, isDotformate) => {
  if (!dateInMiliSec) return "-";

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(1000 * +dateInMiliSec);

  if(isDotformate) {
    const dotFormattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.');;
    return dotFormattedDate;
  }

  const formattedDate = date.toLocaleDateString('en-US', options)?.replace(/,/g, '');
  return formattedDate;
}