import { ComponentInstance, ComponentState } from '../Component/types';
import { Type } from '../Type';
import { ENTITY_PARAMETER_ERROR } from './constants';
import { EntityInstance } from './types';

export const createEntity = (_components: ComponentInstance<ComponentState>[] = []): EntityInstance => {
   const components = _components.filter(Boolean);

   if (!Array.isArray(components)) throw Error(ENTITY_PARAMETER_ERROR);
   if (components.length > 0 && !components.every((c) => c.type === Type.Component)) {
      throw Error(ENTITY_PARAMETER_ERROR);
   }

   const id = Symbol('id');

   return {
      get id() {
         return id;
      },
      get type() {
         return Type.Entity;
      },
      components: Object.freeze(components),
      insert: (component) => components.push(component),
   };
};
