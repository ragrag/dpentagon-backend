import { Container } from 'typedi';
import { v4 as uuid } from 'uuid';
import { CreatePhotoPostDTO } from '../common/dtos/post/createPhotoPost.dto';
import { Post } from '../entities/post.entity';
import { User } from '../entities/users.entity';
import GCSService from './gcs.service';

class PostService {
  public async createPhotoPost(user: User, postDTO: CreatePhotoPostDTO): Promise<Post> {
    const GCSServiceInstance = Container.get(GCSService);
    const postPhotoUrl = await GCSServiceInstance.uploadBase64(postDTO.content, `${user.id}/posts/${uuid()}`);

    const post: Post = await Post.save({
      caption: postDTO.caption,
      postType: 'photo',
      url: postPhotoUrl,
      user: user,
      profession: user.profession,
    } as Post);

    return post;
  }
}

export default PostService;
