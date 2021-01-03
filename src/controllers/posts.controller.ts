import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { CreatePhotoPostDTO } from '../common/dtos/post/createPhotoPost.dto';
import { RequestWithUser } from '../common/interfaces/auth.interface';
import PostService from '../services/posts.service';

class PostsController {
  public postService = new PostService();

  public createPhotoPost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postDTO: CreatePhotoPostDTO = plainToClass(CreatePhotoPostDTO, req.body, { excludeExtraneousValues: true });
      const post = await this.postService.createPhotoPost(req.user, postDTO);
      res.status(201).json({ ...post });
    } catch (error) {
      next(error);
    }
  };

  public getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { posts, hasMore } = await this.postService.findPosts(req.query as any, {
        page: req.query.page,
        limit: req.query.limit,
      });
      res.status(200).json({ posts, hasMore });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const post = await this.postService.findPostById(postId);
      res.status(200).json({ ...post });
    } catch (error) {
      next(error);
    }
  };

  public deletePostById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const post = await this.postService.deletePostById(req.user, postId);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  public getUserPostsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const { posts, hasMore } = await this.postService.findUserPostsById(userId, {
        page: req.query.page,
        limit: req.query.limit,
      });
      res.status(200).json({ posts, hasMore });
    } catch (error) {
      next(error);
    }
  };

  public getCataloguePostsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const catalogueId = Number(req.params.id);
      const { posts, hasMore } = await this.postService.findCataloguePostsById(catalogueId, {
        page: req.query.page,
        limit: req.query.limit,
      });
      res.status(200).json({ posts, hasMore });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;
