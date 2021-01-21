import * as Boom from '@hapi/boom';
import { Container } from 'typedi';
import { v4 as uuid } from 'uuid';
import { CreatePhotoPostDTO } from '../common/dtos/post/createPhotoPost.dto';
import { GetPostsDTO } from '../common/dtos/post/getPosts.dto';
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
    const postPhotoUrl = await GCSServiceInstance.uploadBase64(postDTO.content, `users/${user.id}/posts/${uuid()}`);

    const post: Post = await Post.save({
      caption: postDTO.caption,
      postType: 'photo',
      url: postPhotoUrl,
      catalogue: catalogue,
      profession: user.profession,
    } as Post);

    return post;
  }

  public async findPosts(queryParams: GetPostsDTO, { page, limit }): Promise<{ posts: Post[]; hasMore: boolean }> {
    const query = Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.catalogue', 'catalogue')
      .leftJoinAndSelect('catalogue.user', 'user')
      .leftJoinAndSelect('user.profession', 'user_profession')
      .leftJoinAndSelect('post.profession', 'profession');
    // console.log(queryParams);
    if (queryParams.profession)
      query.where('LOWER(profession.name) IN (:...professions)', { professions: queryParams.profession.split(';').map(el => el.toLowerCase()) });
    if (queryParams.userType) query.andWhere('user.userType = :userType', { userType: queryParams.userType.toLowerCase() });
    if (queryParams.country) query.andWhere('LOWER(user.country) = :country', { country: queryParams.country.toLowerCase() });
    if (queryParams.caption) {
      query.orWhere('LOWER(post.caption) ILIKE :caption', { caption: `%${queryParams.caption.toLowerCase()}%` });
      query.orWhere('LOWER(user.displayName) ILIKE :caption', { caption: `%${queryParams.caption.toLowerCase()}%` });
      query.orWhere('LOWER(profession.name) ILIKE :caption', { caption: `%${queryParams.caption.toLowerCase()}%` });
      query.orWhere('LOWER(catalogue.name) ILIKE :caption', { caption: `%${queryParams.caption.toLowerCase()}%` });
    }
    let posts = await query
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit + 1)
      .getMany();

    const hasMore = posts.length > limit;
    if (hasMore) posts = posts.slice(0, limit);
    return { posts, hasMore };
  }

  public async findPostById(id: number): Promise<Post> {
    const post: Post = await Post.findOne(id);
    if (!post) throw Boom.notFound();
    return post;
  }

  public async deletePostById(user: User, postId: number): Promise<void> {
    const post: Post = await Post.findOne(postId, { relations: ['catalogue'] });
    if (!post) throw Boom.notFound("Psost doesn't exist");
    if (post.catalogue.user.id !== user.id) throw Boom.unauthorized("You don't own this post");
    await Post.delete(postId);
  }

  public async findUserPostsById(userId, { page, limit }): Promise<{ posts: Post[]; hasMore: boolean }> {
    let posts: Post[] = await Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.catalogue', 'catalogue')
      .leftJoin('catalogue.user', 'user')
      .leftJoinAndSelect('post.profession', 'profession')
      .where('user.id = :id', { id: userId })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit + 1)
      .getMany();
    const hasMore = posts.length > limit;
    if (hasMore) posts = posts.slice(0, limit);
    return { posts, hasMore };
  }

  public async findCataloguePostsById(catalogueId, { page, limit }): Promise<{ posts: Post[]; hasMore: boolean }> {
    let posts: Post[] = await Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.catalogue', 'catalogue')
      .leftJoinAndSelect('catalogue.user', 'user')
      .leftJoinAndSelect('user.profession', 'user_profession')
      .leftJoinAndSelect('post.profession', 'profession')
      .where('catalogue.id = :id', { id: catalogueId })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit + 1)
      .getMany();
    const hasMore = posts.length > limit;
    if (hasMore) posts = posts.slice(0, limit);
    return { posts, hasMore };
  }
}

export default PostService;
