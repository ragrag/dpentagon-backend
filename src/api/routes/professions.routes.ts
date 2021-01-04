import { Router } from 'express';
import Route from '../../common/interfaces/routes.interface';
import ProfessionsController from '../../controllers/professions.controller';
import '../middlewares/passport';

class ProfessionsRoute implements Route {
  public path = '/professions';
  public router = Router();
  public professionsController = new ProfessionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.professionsController.getAllProfessions);
  }
}

export default ProfessionsRoute;
