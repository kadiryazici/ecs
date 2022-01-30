import { EntityInstance } from '../Entity/types';

export interface World {
   insert(entity: EntityInstance): void;
   remove(entity: EntityInstance | symbol): void;
   clear(): void;
   readonly entities: EntityInstance[];
}
