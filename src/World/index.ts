import { Entity } from '../Entity/types';
import { Type } from '../Type';
import { insertEntity, removeEntity } from './helpers';
import { World } from './types';

export const createWorld = (): World => {
   const entities = [] as Entity[];
   const id = Symbol('id');

   return {
      get entities() {
         return entities;
      },
      get type() {
         return Type.World;
      },
      get id() {
         return id;
      },
      insert: (entity) => insertEntity(entities, entity),
      remove: (entity) => removeEntity(entities, entity),
      clear: () => {
         entities.length = 0;
      },
   };
};
