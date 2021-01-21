import * as Boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import * as _ from 'lodash';
import Container from 'typedi';
import { v4 as uuid } from 'uuid';
import { UpdateUserDTO, UpdateUserPasswordDTO } from '../common/dtos';
import { UpdateUserPhotoDTO } from '../common/dtos/user/updateUserPhoto.dto';
import { isEmpty } from '../common/utils/util';
import { Profession } from '../entities/profession.entity';
import { User } from '../entities/users.entity';
import GCSService from './gcs.service';

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

    //validate company having a null address
    if (findUser.userType === 'company' && !updateUserDTO.address) throw Boom.badRequest('Companies must have an address');
    await User.update(userId, { ...updateUserDTO });
  }

  public async updateUserPhoto(userId: number, photoDTO: UpdateUserPhotoDTO): Promise<string> {
    const GCSServiceInstance = Container.get(GCSService);
    const photoUrl = await GCSServiceInstance.uploadBase64(photoDTO.photo, `users/${userId}/photos/displayphoto`);
    await User.update(userId, { photo: photoUrl });
    return photoUrl;
  }

  public async updateUserCoverPhoto(userId: number, photoDTO: UpdateUserPhotoDTO): Promise<string> {
    const GCSServiceInstance = Container.get(GCSService);
    const photoUrl = await GCSServiceInstance.uploadBase64(photoDTO.photo, `users/${userId}/photos/coverphoto`);
    await User.update(userId, { coverPhoto: photoUrl });
    return photoUrl;
  }

  public async deleteUserPhoto(userId: number): Promise<void> {
    await User.update(userId, { photo: null });
  }

  public async deleteUserCoverPhoto(userId: number): Promise<void> {
    await User.update(userId, { coverPhoto: null });
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
