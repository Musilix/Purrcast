import { InternalServerErrorException } from '@nestjs/common';

export default function checkForCat(tags: any) {
  const hasCat = tags.some((tag: any) =>
    tag.tag.en.match(/cat|kitten|feline|kitty/i),
  );

  const isRealCat = !tags.some((tag: any) =>
    tag.tag.en.match(/art|sketch|paint|draw|doodle/i),
  );

  // Check if image is a drawing FIRST
  if (!isRealCat) {
    throw new InternalServerErrorException(
      "You gotta make sure you're uploading a real cat picture. No drawings allowed! I'm so sorry.",
    );
  }

  // Check if the image is a cat now...
  if (!hasCat) {
    throw new InternalServerErrorException(
      "You gotta make sure you're uploading a cat picture, bruh!",
    );
  }
}
