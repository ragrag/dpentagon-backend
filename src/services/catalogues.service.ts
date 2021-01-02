import * as Boom from '@hapi/boom';
import { Container } from 'typedi';
import { v4 as uuid } from 'uuid';
import { CreateCatalogueDTO } from '../common/dtos/catalogue/createCatalogue.dto';
import { CreatePhotoPostDTO } from '../common/dtos/post/createPhotoPost.dto';
import { Catalogue } from '../entities/catalogue.entity';
import { Post } from '../entities/post.entity';
import { User } from '../entities/users.entity';
import GCSService from './gcs.service';

class CatalogueService {
  public async createCatalogue(user: User, catalogueDTO: CreateCatalogueDTO): Promise<Catalogue> {
    const catalogue = await Catalogue.save({
      user: user,
      name: catalogueDTO.name,
    } as Catalogue);
    return catalogue;
  }
}

export default CatalogueService;
