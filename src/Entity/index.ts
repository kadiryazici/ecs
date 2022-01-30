import { ComponentInstance, ComponentState } from '../Component/types';
import { Type } from '../Type';
import { ENTITY_PARAMETER_ERROR } from './constants';
import { Entity } from './types';

export const createEntity = (_components: ComponentInstance<ComponentState>[] = []): Entity => {
   const components = _components.filter(Boolean);

   if (!Array.isArray(components)) throw Error(ENTITY_PARAMETER_ERROR);
   if (components.length > 0 && !components.every((c) => c.type === Type.Component)) {
      throw Error(ENTITY_PARAMETER_ERROR);
   }

   let componentsWillReturn = Object.freeze([...components]);
   const resetComponentsWillReturn = () => {
      componentsWillReturn = [...components];
   };

   const id = Symbol('id');

   return {
      get id() {
         return id;
      },
      get type() {
         return Type.Entity;
      },
      components: componentsWillReturn,
      insert: (component) => {
         components.push(component);
         resetComponentsWillReturn();
      },
      remove: (component) => {
         const index = components.findIndex((c) => c.id === component.id);
         if (index >= 0) {
            components.splice(index, 1);
            resetComponentsWillReturn();
         }
      },
   };
};
