import * as bcrypt from 'bcrypt';

export async function hashLocation(locationObject) {
  const saltOrRounds = 10;
  const toHash = Object.entries(locationObject).reduce((acc, [, value]) => {
    return acc + value;
  }, '');

  const hash = await bcrypt.hash(toHash, saltOrRounds);

  return hash;
}

export async function verifyHashedLocation(locationObject, hashedLocation) {
  const toCompare = Object.entries(locationObject).reduce(
    (acc, [key, value]) => {
      if (key !== 'fingerprint') {
        return acc + value;
      } else {
        return acc + '';
      }
    },
    '',
  );
  console.log('toCompare', toCompare);
  const isMatch = await bcrypt.compare(toCompare, hashedLocation);

  return isMatch;
}
