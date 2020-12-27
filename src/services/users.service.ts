import bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from '../common/dtos';
import * as Boom from '@hapi/boom';
import eventEmitter from '../common/utils/eventEmitter';
import { User } from '../entities/users.entity';
import { isEmpty } from '../common/utils/util';

class UserService {
  private Events = {
    USER_CREATED: 'UserCreated',
  };

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await User.find();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await User.findOne(userId);
    if (!findUser) throw Boom.notFound();

    return findUser;
  }

  public async createUser(userData: CreateUserDTO): Promise<User> {
    if (isEmpty(userData)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw Boom.conflict(`Your email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser: User = await User.save({ ...userData, password: hashedPassword } as User);
    eventEmitter.emit(this.Events.USER_CREATED, createdUser.email);
    return createdUser;
  }

  public async updateUser(userId: number, updateUserDTO: UpdateUserDTO): Promise<void> {
    if (isEmpty(updateUserDTO)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    await User.update(userId, { ...updateUserDTO });
  }

  public async updateUserPassword(userId: number, updateUserPasswordDTO: UpdateUserPasswordDTO): Promise<void> {
    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    const isPasswordMatching: boolean = await bcrypt.compare(updateUserPasswordDTO.oldPassword, findUser.password);
    if (!isPasswordMatching) throw Boom.unauthorized('Incorrect old password');
    const hashedPassword = await bcrypt.hash(updateUserPasswordDTO.newPassword, 10);
    await User.update(userId, { password: hashedPassword });
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    await User.delete({ id: userId });
    return findUser;
  }
}

export default UserService;
