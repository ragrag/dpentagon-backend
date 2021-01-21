import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { CreateCatalogueDTO } from '../common/dtos/catalogue/createCatalogue.dto';
import { UpdateCatalogueDTO } from '../common/dtos/catalogue/updateCatalogue.dto';
import { CreatePhotoPostDTO } from '../common/dtos/post/createPhotoPost.dto';
import { RequestWithUser } from '../common/interfaces/auth.interface';
import CatalogueService from '../services/catalogues.service';

class CataloguesController {
  public cataloguesService = new CatalogueService();

  public createCatalogue = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const catalogueDTO: CreateCatalogueDTO = plainToClass(CreateCatalogueDTO, req.body, { excludeExtraneousValues: true });
      const catalogue = await this.cataloguesService.createCatalogue(req.user, catalogueDTO);
      res.status(201).json({ ...catalogue });
    } catch (error) {
      next(error);
    }
  };

  public getUserCatalogues = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const { catalogues, hasMore } = await this.cataloguesService.getUserCatalogues(userId, { page: req.query.page, limit: req.query.limit });
      res.status(200).json({ catalogues, hasMore });
    } catch (error) {
      next(error);
    }
  };

  public getCatalogueById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const catalogueId = Number(req.params.id);
      const catalogue = await this.cataloguesService.getCatalogueById(catalogueId);
      res.status(200).json(catalogue);
    } catch (error) {
      next(error);
    }
  };

  public updateCatalogueById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const catalogueId = Number(req.params.id);
      const catalogueDTO: UpdateCatalogueDTO = plainToClass(UpdateCatalogueDTO, req.body, { excludeExtraneousValues: true });
      const newCataloguePhotoUrl = await this.cataloguesService.updateCatalogueById(req.user, { catalogueId, catalogueDTO });
      res.status(200).send({ url: newCataloguePhotoUrl });
    } catch (error) {
      next(error);
    }
  };

  public deleteCatalogueById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const catalogueId = Number(req.params.id);
      await this.cataloguesService.deleteCatalogueById(req.user, catalogueId);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}

export default CataloguesController;
