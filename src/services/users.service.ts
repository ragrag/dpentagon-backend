import * as Boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { UpdateUserDTO, UpdateUserPasswordDTO } from '../common/dtos';
import { isEmpty } from '../common/utils/util';
import { Profession } from '../entities/profession.entity';
import { User } from '../entities/users.entity';

class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await User.find();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await User.findOne(userId);
    if (!findUser) throw Boom.notFound();

    return findUser;
  }

  public async updateUser(userId: number, updateUserDTO: UpdateUserDTO): Promise<void> {
    if (isEmpty(updateUserDTO)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    const profession = await Profession.findOne(updateUserDTO.professionId);
    if (!profession) throw Boom.notFound("Profession doesn't exist");
    updateUserDTO.profession = profession;
    updateUserDTO = _.omit(updateUserDTO, ['professionId']);
    await User.update(userId, { ...updateUserDTO });
  }

  public async updateUserPassword(userId: number, updateUserPasswordDTO: UpdateUserPasswordDTO): Promise<void> {
    const user: User = await User.findOne({ where: { id: userId }, select: ['id', 'password'] });
    if (!user) throw Boom.notFound();

    const isPasswordMatching: boolean = await bcrypt.compare(updateUserPasswordDTO.oldPassword, user.password);
    if (!isPasswordMatching) throw Boom.badRequest('Incorrect old password');
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
