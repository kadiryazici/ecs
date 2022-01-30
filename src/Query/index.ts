import { Component, ComponentInstance } from '../Component/types';
import { Entity } from '../Entity/types';
import { World } from '../World/types';
import { QueryType } from './constants';
import { findComponentInEntity } from './helpers';
import { MapQueryReturn, Query, QueryModifier } from './types';

export function createQuery<T extends [Component, ...Component[]], QueryReturn = MapQueryReturn<T>>(
   queryComponents: T,
   ...modifiers: QueryModifier[]
): Query<QueryReturn[]> {
   const id = Symbol('id');

   const withModifiers = new Set<Component>();
   const withoutModifiers = new Set<Component>();
   modifiers.forEach((modifier) => {
      const targetModifier = modifier.type === QueryType.With ? withModifiers : withoutModifiers;
      modifier.components.forEach((component) => {
         targetModifier.add(component);
      });
   });

   return {
      get id() {
         return id;
      },

      exec(world: World) {
         let foundEntities = [] as (Entity | null)[];

         for (const entity of world.entities) {
            const foundComponents = [] as (ComponentInstance | null)[];

            for (const component of queryComponents) {
               foundComponents.push(findComponentInEntity(entity, component));
            }

            if (foundComponents.every(Boolean)) {
               foundEntities.push(entity);
            }
         }

         foundEntities = foundEntities.map((entity) => {
            if (entity) {
               const foundComponents = [] as (ComponentInstance | null)[];

               for (const component of withModifiers) {
                  foundComponents.push(findComponentInEntity(entity, component));
               }

               if (foundComponents.every(Boolean)) {
                  return entity;
               }
            }

            return null!;
         });

         foundEntities = foundEntities.map((entity) => {
            if (entity) {
               const foundComponents = [] as (ComponentInstance | null)[];

               for (const component of withoutModifiers) {
                  foundComponents.push(findComponentInEntity(entity, component));
               }

               if (foundComponents.some(Boolean)) {
                  return null!;
               }
            }

            return entity;
         });

         return (foundEntities.filter(Boolean) as Entity[]).map((entity) => {
            return queryComponents.map((component) => {
               return entity.components.find((c) => c.id === component.id)!.state;
            });
         }) as unknown as QueryReturn[];
      },
   };
}
