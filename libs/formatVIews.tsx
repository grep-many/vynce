const formatViews = (num: number) =>
  num >= 1_000_000_000_000
    ? (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T'
    : num >= 1_000_000_000
    ? (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    : num >= 1_000_000
    ? (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    : num >= 1_000
    ? (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    : num.toString();

export default formatViews;
