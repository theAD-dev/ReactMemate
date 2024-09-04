function adjustColor(color, amount) {
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