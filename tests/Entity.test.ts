import { expect, it } from 'vitest';
import { defineComponent, createEntity } from '../src/lib';

it('should check entity features', () => {
   const Player = createEntity();

   expect(Player.components.length).toBe(0);

   const Velocity = defineComponent(() => ({ x: 0, y: 0 }));

   Player.add(Velocity.create({ x: 5, y: 5 }));
   expect(Player.components.length).toBe(1);
   expect(Player.components[0].state).toEqual({
      x: 5,
      y: 5,
   });

   Player.add(Velocity.create());
   expect(Player.components.length).toBe(1);
   expect(Player.components[0].state).toEqual({ x: 0, y: 0 });

   Player.remove(Velocity);
   expect(Player.components.length).toBe(0);

   const Size = defineComponent(() => ({ width: 0, height: 0 }));
   Player.add(Size.create({ width: 25 }));
   Player.add(Size.create({ width: 150 }));
   expect(Player.components.length).toBe(1);
   expect(Player.components[0].state.width).toBe(150);
});
