import { Component, ComponentInstance } from '../Component/types';
import { Entity } from '../Entity/types';
import { World } from '../World/types';
import { QueryType } from './constants';
import { findComponentInEntity } from './helpers';
import { MapQueryReturn, QueryModifier } from './types';

export function createQuery<T extends [Component, ...Component[]], QueryReturn = MapQueryReturn<T>>(
   components: T,
   ...modifiers: QueryModifier[]
) {
   const id = Symbol('id');

   const withModifiers = new Set<Component>();
   const withoutModifiers = new Set<Component>();
   modifiers.forEach((modifier) => {
      const targetModifier = modifier.type === QueryType.With ? withModifiers : withoutModifiers;
      modifier.components.forEach((component) => {
         targetModifier.add(component);
      });
   });

   const componentsID = components.map((c) => c.id);

   return {
      get id() {
         return id;
      },

      execute(world: World) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const foundStates = [] as QueryReturn[];

         for (const entity of world.entities) {
            const foundComponents = [] as (ComponentInstance | null)[];
            for (const component of components) {
               foundComponents.push(findComponentInEntity(entity, component));
            }
            if (foundComponents.every(Boolean)) {
               const states = foundComponents.map((c) => c!.state) as unknown as QueryReturn;
               foundStates.push(states);
            }
         }

         return foundStates;
      },
   };
}

// const components = world.entities.map((entity) => {
//    const componentIndex = entity.components.findIndex((component) => component.id === query.id);
//    if (componentIndex >= 0) {
//       return entity.components[componentIndex];
//    }
//    return null!;
// });

// return components.filter(Boolean).map((v) => v.state as State);
