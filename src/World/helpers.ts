import { Entity } from '../Entity/types';

export const insertEntity = (entities: Entity[], entity: Entity) => {
   const entityIndex = entities.indexOf(entity);
   if (entityIndex === -1) {
      entities.push(entity);
   }
};

export const removeEntity = (entities: Entity[], entity: Entity | symbol) => {
   const id = typeof entity === 'symbol' ? entity : entity.id;
   const entityIndex = entities.findIndex((e) => e.id === id);

   if (entityIndex >= 0) {
      entities.splice(entityIndex, 1);
   }
};
