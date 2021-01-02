import * as Boom from '@hapi/boom';
import { Container } from 'typedi';
import { v4 as uuid } from 'uuid';
import { CreatePhotoPostDTO } from '../common/dtos/post/createPhotoPost.dto';
import { Catalogue } from '../entities/catalogue.entity';
import { Post } from '../entities/post.entity';
import { User } from '../entities/users.entity';
import GCSService from './gcs.service';

class PostService {
  public async createPhotoPost(user: User, postDTO: CreatePhotoPostDTO): Promise<Post> {
    const catalogue = await Catalogue.findOne(postDTO.catalogueId);
    if (!catalogue) throw Boom.notFound("Catalogue Doesn't exist");
    if (catalogue.user.id !== user.id) throw Boom.unauthorized("You don't own this catalogue");
    const GCSServiceInstance = Container.get(GCSService);
    const postPhotoUrl = await GCSServiceInstance.uploadBase64(postDTO.content, `${user.id}/posts/${uuid()}`);
    const post: Post = await Post.save({
      caption: postDTO.caption,
      postType: 'photo',
      url: postPhotoUrl,
      catalogue: catalogue,
      profession: user.profession,
    } as Post);

    return post;
  }

  public async findPostById(id: number): Promise<Post> {
    const post: Post = await Post.findOne(id);
    if (!post) throw Boom.notFound();
    return post;
  }

  public async findUserPostsById(userId, { page, limit }): Promise<{ posts: Post[]; hasMore: boolean }> {
    let posts: Post[] = await Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.catalogue', 'catalogue')
      .leftJoin('catalogue.user', 'user')
      .leftJoinAndSelect('post.profession', 'profession')
      .where('user.id = :id', { id: userId })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .limit(limit + 1)
      .getMany();
    const hasMore = posts.length > limit;
    if (hasMore) posts = posts.slice(0, limit);
    return { posts, hasMore };
  }
}

export default PostService;
