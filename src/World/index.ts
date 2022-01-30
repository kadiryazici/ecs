import { Entity } from '../Entity/types';
import { insertEntity, removeEntity } from './helpers';
import { World } from './types';

export const createWorld = (): World => {
   const entities = [] as Entity[];

   return {
      get entities() {
         return entities;
      },
      insert: (entity) => insertEntity(entities, entity),
      remove: (entity) => removeEntity(entities, entity),
      clear: () => {
         entities.length = 0;
      },
   };
};
