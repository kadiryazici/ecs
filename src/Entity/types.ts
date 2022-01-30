import { ComponentInstance, ComponentState } from '../Component/types';
import { Type } from '../Type';

export interface EntityInstance {
   readonly id: symbol;
   readonly type: typeof Type.Entity;
   readonly components: readonly ComponentInstance<ComponentState>[];
   insert(component: ComponentInstance<ComponentState>): void;
}
