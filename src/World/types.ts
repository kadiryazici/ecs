import { Entity } from '../Entity/types';

export interface World {
   insert(entity: Entity): void;
   remove(entity: Entity | symbol): void;
   clear(): void;
   readonly entities: Entity[];
}
