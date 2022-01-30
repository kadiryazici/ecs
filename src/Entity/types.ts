import { Component, ComponentInstance, ComponentState } from '../Component/types';
import { Type } from '../Type';

export interface Entity {
   readonly id: symbol;
   readonly type: typeof Type.Entity;
   readonly components: readonly ComponentInstance<ComponentState>[];
   insert(component: ComponentInstance<ComponentState>): void;
   remove(component: Component<ComponentState>): void;
}
