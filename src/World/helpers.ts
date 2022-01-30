import { EntityInstance } from '../Entity/types';

export const insertEntity = (entities: EntityInstance[], entity: EntityInstance) => {
   entities.push(entity);
};

export const removeEntity = (entities: EntityInstance[], entity: EntityInstance | symbol) => {
   const id = typeof entity === 'symbol' ? entity : entity.id;
   const entityIndex = entities.findIndex((e) => e.id === id);

   if (entityIndex >= 0) {
      entities.splice(entityIndex, 1);
   }
};
