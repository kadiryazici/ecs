import { Entity } from '../Entity/types';
import { Type } from '../Type';

export interface World {
   insert(entity: Entity): void;
   remove(entity: Entity | symbol): void;
   clear(): void;
   readonly entities: Entity[];
   readonly type: typeof Type.World;
   readonly id: symbol;
}
