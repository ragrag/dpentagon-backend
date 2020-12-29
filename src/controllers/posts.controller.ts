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
      res.status(200).json({ ...post });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;
