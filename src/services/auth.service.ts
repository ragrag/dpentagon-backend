import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Boom from '@hapi/boom';
import { CreateUserDTO } from '../common/dtos/user/createUser.dto';
import { DataStoredInToken, TokenData } from '../common/interfaces/auth.interface';
import { User } from '../entities/users.entity';
import { isEmpty } from '../common/utils/util';
import { Profession } from '../entities/profession.entity';
import { plainToClass } from 'class-transformer';
import { LoginUserDTO } from '../common/dtos';

class AuthService {
  public async register(userData: CreateUserDTO): Promise<User> {
    if (isEmpty(userData)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw Boom.conflict(`a user with the email ${userData.email} already exists`);

    const profession: Profession = await Profession.findOne(userData.professionId);
    if (!profession) throw Boom.notFound("Profession doesn't exist");

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const createUserData: User = await User.save(plainToClass(User, { ...userData, password: hashedPassword, profession: profession }));
    return createUserData;
  }

  public async login(userData: LoginUserDTO): Promise<{ token: string; user: User }> {
    const user: User = await User.findOne({ where: { email: userData.email } });
    if (!user) throw Boom.notFound();

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordMatching) throw Boom.unauthorized();

    const { token } = this.createToken(user);

    return { token, user };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }
}

export default AuthService;
