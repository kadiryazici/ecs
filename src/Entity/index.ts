import { Component, ComponentDescriptor, DefaultStateType } from '../Component';

export const EntityId = Symbol('EntityId');

export class Entity {
   public components: ComponentDescriptor[] = [];

   public id = Symbol('Entity');

   private _findIndex(componentOrDesc: ComponentDescriptor | Component) {
      if (componentOrDesc instanceof Component) {
         return this.components.findIndex((componentDesc) => componentOrDesc.id === componentDesc.componentId);
      }
      return this.components.findIndex((comp) => componentOrDesc.id === comp.id);
   }

   public add(componentOrDesc: ComponentDescriptor) {
      const componentIndex = this.components.findIndex((c) => c.componentId === componentOrDesc.componentId);
      if (componentIndex >= 0) {
         this.components[componentIndex] = componentOrDesc;
      } else {
         this.components.push(componentOrDesc);
      }

      return this;
   }

   public remove(componentOrDesc: Component | ComponentDescriptor) {
      const index = this._findIndex(componentOrDesc);

      if (index >= 0) {
         this.components.splice(index, 1);
      }

      return this;
   }

   public find<State extends DefaultStateType = DefaultStateType>(
      componentOrDesc: Component<State> | ComponentDescriptor<State>,
   ): ComponentDescriptor<State> | null {
      const index = this._findIndex(componentOrDesc);

      if (index >= 0) return this.components[index] as ComponentDescriptor<State>;
      return null;
   }

   public has(componentOrDesc: Component | ComponentDescriptor): boolean {
      return this._findIndex(componentOrDesc) >= 0;
   }
}

export const createEntity = () => new Entity();
