import { Component } from '../Component';
import { Entity, EntityId } from '../Entity';
import { World } from '../World';
import { Modifier } from './constants';
import type { QueryComponents, MapQueryReturn, QueryModifier } from './types';

export class Query<T extends QueryComponents> {
   private _modifiers: QueryModifier[] = [];

   private _withComponents = new Set<Component>();

   private _withoutComponents = new Set<Component>();

   constructor(private _components: T, ...modifiers: QueryModifier[]) {
      this._modifiers = modifiers.slice();

      modifiers.forEach((modifier) => {
         const modifierComponentSet = modifier.type === Modifier.With ? this._withComponents : this._withoutComponents;
         modifier.components.forEach((component) => {
            modifierComponentSet.add(component);
         });
      });
   }

   public exec(world: World): MapQueryReturn<T>[] {
      const matchingEntities = [] as Entity[];
      const queryComponents = this._components.filter(
         (component): component is Component => component instanceof Component,
      );

      for (const entity of world.entities) {
         if (
            [...this._withoutComponents].some((component) => entity.has(component)) ||
            ![...this._withComponents].every((component) => entity.has(component)) ||
            !queryComponents.every((component) => entity.has(component))
         ) {
            // eslint-disable-next-line no-continue
            continue;
         }

         matchingEntities.push(entity);
      }

      return matchingEntities.map((entity) => {
         return this._components.map((component) => {
            if (component === EntityId) return entity.id;
            return entity.find(component)!.state;
         });
      }) as MapQueryReturn<T>[];
   }

   // public exec(world: World) {
   //    let foundEntities = [] as (Entity | null)[];

   //    for (const entity of world.entities) {
   //       const foundComponents = [] as (ComponentDescriptor | null)[];

   //       for (const component of this._components) {
   //          entity.find(component);
   //       }

   //       if (foundComponents.every(Boolean)) {
   //          foundEntities.push(entity);
   //       }
   //    }

   //    foundEntities = foundEntities.map((entity) => {
   //       if (entity) {
   //          const foundComponents = [] as (ComponentInstance | null)[];

   //          for (const component of withModifiers) {
   //             foundComponents.push(findComponentInEntity(entity, component));
   //          }

   //          if (foundComponents.every(Boolean)) {
   //             return entity;
   //          }
   //       }

   //       return null!;
   //    });

   //    foundEntities = foundEntities.map((entity) => {
   //       if (entity) {
   //          const foundComponents = [] as (ComponentInstance | null)[];

   //          for (const component of withoutModifiers) {
   //             foundComponents.push(findComponentInEntity(entity, component));
   //          }

   //          if (foundComponents.some(Boolean)) {
   //             return null!;
   //          }
   //       }

   //       return entity;
   //    });

   //    return (foundEntities.filter(Boolean) as Entity[]).map((entity) => {
   //       return queryComponents.map((component) => {
   //          return entity.components.find((c) => c.id === component.id)!.state;
   //       });
   //    }) as unknown as QueryReturn[];
   // }
}

export function createQuery<T extends QueryComponents>(components: T, ...modifiers: QueryModifier[]) {
   return new Query(components, ...modifiers);
}
