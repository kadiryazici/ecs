import { Entity } from '../Entity';

export class World {
   public entities: Set<Entity> = new Set();

   public add(entity: Entity) {
      this.entities.add(entity);
      return this;
   }

   public remove(entity: Entity | symbol) {
      if (entity instanceof Entity) {
         this.entities.delete(entity);
         return this;
      }

      for (const _entity of this.entities) {
         if (_entity.id === entity) {
            this.entities.delete(_entity);
            break;
         }
      }

      return this;
   }

   public clear() {
      this.entities.clear();
      return this;
   }

   public findEntity(eid: symbol): Entity | undefined {
      return [...this.entities].find((entity) => entity.id === eid);
   }
}

export const createWorld = () => new World();
