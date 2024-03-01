export function getUpVoteBarLength(postVotes: number): string {
  console.log('getting upvoted shits');
  if (postVotes >= 0 && postVotes <= 999) {
    return 'w-[100px]';
  } else if (postVotes > 999 && postVotes <= 9999) {
    return 'w-[125px]';
  } else if (postVotes > 9999 && postVotes <= 99999) {
    return 'w-[150px]';
  } else {
    return 'w-[200px]';
  }
}
