import * as Boom from '@hapi/boom';
import { Container } from 'typedi';
import { v4 as uuid } from 'uuid';
import { CreateCatalogueDTO } from '../common/dtos/catalogue/createCatalogue.dto';
import { UpdateCatalogueDTO } from '../common/dtos/catalogue/updateCatalogue.dto';
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

  public async getCatalogueById(catalogueId): Promise<Catalogue> {
    const catalogue = await Catalogue.findOne(catalogueId);
    if (!catalogue) throw Boom.notFound("Catalogue Doesn't exist");

    return catalogue;
  }

  public async updateCatalogueById(
    user: User,
    { catalogueId, catalogueDTO }: { catalogueId: number; catalogueDTO: UpdateCatalogueDTO },
  ): Promise<void> {
    const catalogue = await Catalogue.findOne(catalogueId);
    if (!catalogue) throw Boom.notFound("Catalogue Doesn't exist");
    if (catalogue.user.id !== user.id) throw Boom.unauthorized("You don't own this catalogue");
    await Catalogue.update(catalogueId, { ...catalogueDTO });
  }

  public async deleteCatalogueById(user: User, catalogueId): Promise<void> {
    const catalogue = await Catalogue.findOne(catalogueId);
    if (!catalogue) throw Boom.notFound("Catalogue Doesn't exist");
    if (catalogue.user.id !== user.id) throw Boom.unauthorized("You don't own this catalogue");
    await Catalogue.delete(catalogueId);
  }

  public async getUserCatalogues(userId: number, { page, limit }): Promise<{ catalogues: Catalogue[]; hasMore: boolean }> {
    let catalogues = await Catalogue.createQueryBuilder('catalogue')
      .leftJoin('catalogue.user', 'user')
      .where('user.id = :id', { id: userId })
      .orderBy('catalogue.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit + 1)
      .getMany();
    const hasMore = catalogues.length > limit;
    if (hasMore) catalogues = catalogues.slice(0, limit);
    return { catalogues, hasMore };
  }
}

export default CatalogueService;
