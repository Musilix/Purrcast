import { InternalServerErrorException } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

export default async function uploadToCloudinary(
  cloudinary: CloudinaryService,
  img,
) {
  /*
        The options sent to our cloudinary service's upload method here are using an upload type of just 'upload'.
        If we wanted to strengthen our security, we could use the 'authenticated' upload type or even private
      */
  const res: UploadApiResponse = await cloudinary
    .upload(img, {
      resource_type: 'image',
      unique_filename: true,
      overwrite: false,
      format: 'png',
      type: 'upload', //TODO - change this to authenticated or private if we decide to utilize token-based access control
      // TODO - in the future, it may be necessary to hide assets with access_control settings
      // If I continue to use cloudinary, I will need to contact them for a encrpytion key to generate valid tokens for authenticated users to access assets
      // access_control: {
      //   access_type: 'token',

      // },
    })
    .catch(() => {
      throw new InternalServerErrorException(
        'Unable to upload your file due to a communication error with our image hosting provider. Please try again later.',
      );
    });

  if (!res || res.secure_url == undefined || res.secure_url == '') {
    throw new InternalServerErrorException(
      'Unable to upload your file due to a communication error with our image hosting provider. Please try again later.',
    );
  }

  return res;
}
