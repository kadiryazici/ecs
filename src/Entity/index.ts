import { ComponentInstance, ComponentState } from '../Component/types';
import { Type } from '../Type';
import { ENTITY_ALREADY_HAS_THE_COMPONENT, ENTITY_PARAMETER_ERROR } from './constants';
import { Entity } from './types';

export const createEntity = (_components: ComponentInstance<ComponentState>[] = []): Entity => {
   let components = _components.filter(Boolean);

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
      get components() {
         return components;
      },
      insert: (component) => {
         const componentIndex = components.findIndex((c) => c.id === component.id);
         if (componentIndex >= 0) {
            // eslint-disable-next-line no-console
            console.error(ENTITY_ALREADY_HAS_THE_COMPONENT);
         } //
         else components.push(component);
      },
      remove: (component) => {
         components = components.filter((c) => c.id !== component.id);
      },
   };
};
