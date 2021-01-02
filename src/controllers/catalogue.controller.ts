import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { CreateCatalogueDTO } from '../common/dtos/catalogue/createCatalogue.dto';
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
}

export default CataloguesController;
