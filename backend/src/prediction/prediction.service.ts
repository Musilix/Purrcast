import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

interface PredictionResponse {
  time: number;
  image: { width: number; height: number };
  predictions: {
    notSleepingOnHead: { confidence: number };
    sleepingOnHead: { confidence: number };
  };
  predicted_classes: string[];
}

/*
TODO - For the time being, directly making an axios call to roboflow to utilize our model works,
        but we are only given 1000 inferences per month, so this is not a viable (free) solution in the long run
        It would be best to get a copy of our model and host it on our own backend (probably a seperate one propped up with Python)
*/
@Injectable()
export class PredictionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async generatePrediction(img_url: string, postId: number) {
    const prediction: PredictionResponse = await axios({
      method: 'POST',
      url: 'https://detect.roboflow.com/is-cat-sleeping-on-head/1',
      params: {
        api_key: this.configService.get('ROBOFLOW_API_KEY'),
        image: img_url,
      },
    })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        //TODO - indicate there was an error with the prediction in the post entry
        console.log(error.message);
      });

    // TODO - change the classification classes to be a bit more... dev friendly?
    const isCatOnHead = prediction.predicted_classes[0] === 'sleepingOnHead';

    await this.prisma.post.update({
      where: { id: postId },
      data: {
        isCatOnHead: isCatOnHead,
      },
    });
  }
}
