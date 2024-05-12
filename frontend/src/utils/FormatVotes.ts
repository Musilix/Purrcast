export default function formatVotes(votes: number) {
  if (votes < 1000) {
    return votes.toString();
  } else if (votes < 1000000) {
    const num = (votes / 1000).toFixed(1);
    return num.replace(/\.0$/, '') + 'k';
  } else if (votes < 1000000000) {
    const num = (votes / 1000000).toFixed(1);
    return num.replace(/\.0$/, '') + 'm';
  } else {
    const num = (votes / 1000000000).toFixed(1);
    return num.replace(/\.0$/, '') + 'b';
  }
}
