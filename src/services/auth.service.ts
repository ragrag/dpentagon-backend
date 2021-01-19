import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Boom from '@hapi/boom';
import { eventEmitter, Events } from '../common/utils/eventEmitter';
import { CreateUserDTO } from '../common/dtos/auth/createUser.dto';
import { DataStoredInToken, PasswordResetToken as EmailToken, TokenData } from '../common/interfaces/auth.interface';
import { User } from '../entities/users.entity';
import { isEmpty } from '../common/utils/util';
import { Profession } from '../entities/profession.entity';
import { plainToClass } from 'class-transformer';
import { LoginUserDTO } from '../common/dtos';
import { ResetPasswordDTO } from '../common/dtos/auth/resetPassword.dto';
import { ConfirmEmailDTO } from '../common/dtos/auth/confirmEmail.dto';
import { ForgetPasswordDTO } from '../common/dtos/auth/forgetPassword.dto';
import { SendConfirmationEmailDTO } from '../common/dtos/auth/sendConfirmationEmail.dto';

class AuthService {
  public async register(userData: CreateUserDTO): Promise<User> {
    if (isEmpty(userData)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw Boom.conflict(`a user with the email ${userData.email} already exists`);

    const profession: Profession = await Profession.findOne(userData.professionId);
    if (!profession) throw Boom.notFound("Profession doesn't exist");

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const createdUser: User = await User.save(plainToClass(User, { ...userData, password: hashedPassword, profession: profession }));

    const { token: emailConfirmationToken } = AuthService.createEmailToken(createdUser.email);
    eventEmitter.emit(Events.USER_REGISTRATION, { email: createdUser.email, token: emailConfirmationToken });

    return createdUser;
  }

  public async login(userData: LoginUserDTO): Promise<{ token: string; user: User }> {
    const user: User = await User.findOne({
      where: { email: userData.email },
      select: [
        'id',
        'password',
        'email',
        'emailConfirmed',
        'profileInfo',
        'userType',
        'profession',
        'displayName',
        'country',
        'phoneNumber',
        'createdAt',
        'updatedAt',
      ],
      relations: ['profession'],
    });
    if (!user) throw Boom.notFound();

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordMatching) throw Boom.unauthorized();

    if (!user.emailConfirmed) throw Boom.forbidden('Email not confirmed');

    const { token } = AuthService.createAuthToken(user);

    return { token, user };
  }

  public async resetPassword(passwordResetDTO: ResetPasswordDTO): Promise<void> {
    let email;
    try {
      const tokenData = (await jwt.verify(passwordResetDTO.token, process.env.JWT_RESET_SECRET)) as EmailToken;
      email = tokenData.email;
    } catch (err) {
      throw Boom.resourceGone('password reset link expired');
    }

    const hashedPassword = await bcrypt.hash(passwordResetDTO.password, 10);
    await User.update(
      {
        email: email,
      },
      { password: hashedPassword },
    );
  }

  public async confirmEmail(confirmEmailDTO: ConfirmEmailDTO): Promise<void> {
    let email;
    try {
      const tokenData = (await jwt.verify(confirmEmailDTO.token, process.env.JWT_RESET_SECRET)) as EmailToken;
      email = tokenData.email;
    } catch (err) {
      throw Boom.resourceGone('confirmation link expired');
    }
    await User.update({ email }, { emailConfirmed: true });
  }

  public async sendPasswordResetEmail(forgetPasswordDTO: ForgetPasswordDTO): Promise<void> {
    const user = await User.findOne({ where: { email: forgetPasswordDTO.email } });
    if (!user) throw Boom.notFound("User with this email doesn't exist");
    const { token } = AuthService.createEmailToken(forgetPasswordDTO.email);
    eventEmitter.emit(Events.PASSWORD_RESET, { email: forgetPasswordDTO.email, token });
  }

  public async sendEmailConfirmation(confirmationEmailDTO: SendConfirmationEmailDTO): Promise<void> {
    const user = await User.findOne({ where: { email: confirmationEmailDTO.email } });
    if (!user) throw Boom.notFound("User with this email doesn't exist");
    const { token } = AuthService.createEmailToken(confirmationEmailDTO.email, '3d');
    eventEmitter.emit(Events.CONFIRMATION_EMAIL, { email: confirmationEmailDTO.email, token });
  }

  public static createAuthToken(user: User, expiresIn = '7d'): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public static createEmailToken(email: string, expiresIn = '2h'): TokenData {
    const dataStoredInToken: EmailToken = { email };
    const secret: string = process.env.JWT_RESET_SECRET;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }
}

export default AuthService;
