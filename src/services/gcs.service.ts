import { Storage } from '@google-cloud/storage';
import * as _ from 'lodash';
import { convertBase64ToBuffer } from '../common/utils/util';

class GCSService {
  private storage;
  private BUCKET_NAME;
  constructor() {
    const privateKey = _.replace(process.env.GCS_PRIVATE_KEY, new RegExp('\\\\n', 'g'), '\n');
    this.BUCKET_NAME = 'this-or-that';
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        private_key: privateKey,
        client_email: process.env.GCS_CLIENT_EMAIL,
      },
    });
  }

  async uploadBase64(photoBase64: string, uploadName: string) {
    try {
      const imageBuffer = convertBase64ToBuffer(photoBase64);
      const bucket = await this.storage.bucket(this.BUCKET_NAME);
      uploadName = `instagram/${uploadName}`;
      const file = bucket.file(uploadName);
      await file.save(imageBuffer, {
        metadata: { contentType: 'image/jpeg' },
        public: true,
        validation: 'md5',
      });
      return `https://storage.googleapis.com/${this.BUCKET_NAME}/${uploadName}`;
    } catch (err) {
      throw new Error('Something went wrong while uploading image');
    }
  }

  /**
   * @param {String} imageName image name to delete.
   */
  async deleteByName(imageName) {
    await this.storage.bucket(this.BUCKET_NAME).file(imageName).delete();
  }

  /**
   * @param {String} prefix prefix of images to delete.
   */
  async deleteManyByPrefix(prefix) {
    await this.storage.bucket(this.BUCKET_NAME).deleteFiles({
      prefix: prefix,
      force: true,
    });
  }
}

export default GCSService;
