export function formatAUD(amount, shorten = false) {
    const num = parseFloat(amount);

    if (isNaN(num)) {
        return "0.00";
    }

    if (shorten && num >= 1000) {
        return new Intl.NumberFormat('en-AU', {
            notation: "compact",
            compactDisplay: "short",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    return new Intl.NumberFormat('en-AU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}