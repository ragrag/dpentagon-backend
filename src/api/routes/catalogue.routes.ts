import { Router } from 'express';
import passport from 'passport';
import '../middlewares/passport';
import PostsController from '../../controllers/posts.controller';
import Route from '../../common/interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import jwtAuthMiddeware from '../middlewares/jwt-cookie-auth.middleware';
import { CreatePhotoPostDTO } from '../../common/dtos/post/createPhotoPost.dto';
import { ObjectIdDTO } from '../../common/dtos/common/objectId.dto';
import { PaginationDTO } from '../../common/dtos/common/pagination.dto';
import setPagination from '../../api/middlewares/setPagination.middleware';
import CataloguesController from '../../controllers/catalogue.controller';
import { CreateCatalogueDTO } from '../../common/dtos/catalogue/createCatalogue.dto';
import { UpdateCatalogueDTO } from '../../common/dtos/catalogue/updateCatalogue.dto';

class CataloguesRoute implements Route {
  public path = '/catalogues';
  public router = Router();
  public catalogueController = new CataloguesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      [jwtAuthMiddeware, validationMiddleware(CreateCatalogueDTO, 'body', false)],
      this.catalogueController.createCatalogue,
    );

    this.router.get(
      `/users/:id/catalogues`,
      [setPagination, validationMiddleware(ObjectIdDTO, 'params', false)],
      this.catalogueController.getUserCatalogues,
    );

    this.router.get(`${this.path}/:id`, [validationMiddleware(ObjectIdDTO, 'params', false)], this.catalogueController.getCatalogueById);

    this.router.put(
      `${this.path}/:id`,
      [jwtAuthMiddeware, validationMiddleware(ObjectIdDTO, 'params', false), validationMiddleware(UpdateCatalogueDTO, 'body', false)],
      this.catalogueController.updateCatalogueById,
    );

    this.router.delete(
      `${this.path}/:id`,
      [jwtAuthMiddeware, validationMiddleware(ObjectIdDTO, 'params', false)],
      this.catalogueController.deleteCatalogueById,
    );
  }
}

export default CataloguesRoute;
