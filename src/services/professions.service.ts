import { Profession } from '../entities/profession.entity';

class ProfessionsService {
  public async findAllProfessions(): Promise<Profession[]> {
    const professions = await Profession.find({});
    return professions;
  }
}

export default ProfessionsService;
