import { expect, it } from 'vitest';
import { defineComponent, Type, createEntity } from '../src/lib';

it('should check entity features', () => {
   const Player = createEntity();

   expect(Player.components.length).toBe(0);
   expect(Player.type).toBe(Type.Entity);

   const Velocity = defineComponent({ x: 0, y: 0 });

   Player.insert(Velocity.new({ x: 5, y: 5 }));
   expect(Player.components.length).toBe(1);
   expect(Player.components[0].state).toEqual({
      x: 5,
      y: 5,
   });

   Player.insert(Velocity.new());
   expect(Player.components.length).toBe(1);
   expect(Player.components[0].state).toEqual({
      x: 5,
      y: 5,
   });

   Player.remove(Velocity);
   expect(Player.components.length).toBe(0);

   const Size = defineComponent({ width: 0, height: 0 });
   Player.insert(Size.new());
   Player.insert(Size.new());
   expect(Player.components.length).toBe(1);
});
