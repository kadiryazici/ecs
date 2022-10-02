import { Component } from '../Component';
import { Entity, EntityId } from '../Entity';
import { typeOf } from '../utils';
import { World } from '../World';
import { Modifier, OptionalSym } from './constants';
import type { QueryComponentsTuple, MapQueryReturn, QueryModifier, OptionalModifier } from './types';

export class Query<T extends QueryComponentsTuple> {
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
            if (component instanceof Component) return entity.find(component)!.state;
            if (typeOf<OptionalModifier>(component, 'Object') && component.type === OptionalSym) {
               return entity.find(component.value)?.state;
            }
            return undefined;
         });
      }) as MapQueryReturn<T>[];
   }
}

export function createQuery<T extends QueryComponentsTuple>(components: T, ...modifiers: QueryModifier[]) {
   return new Query(components, ...modifiers);
}
