import { NextFunction, Request, Response } from 'express';
import { Profession } from '../entities/profession.entity';
import ProfessionsService from '../services/professions.service';

class ProfessionsController {
  public professionsService = new ProfessionsService();

  public getAllProfessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const professions: Profession[] = await this.professionsService.findAllProfessions();
      res.status(200).json(professions);
    } catch (error) {
      next(error);
    }
  };
}

export default ProfessionsController;
