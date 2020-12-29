import { createConnection, getConnection } from 'typeorm';
import dbConnection from '../../db/connection';

export const db = {
  async create() {
    await createConnection(dbConnection);
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
    // const entities = connection.entityMetadatas;

    // const entityDeletionPromises = entities.map(entity => async () => {
    //   const repository = connection.getRepository(entity.name);
    //   await repository.query(`DELETE FROM ${entity.tableName}`,{});
    // });
    // await Promise.all(entityDeletionPromises);
  },
};
