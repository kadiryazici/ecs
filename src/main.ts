import { defineComponent } from './Component';
import { createEntity } from './Entity';
import { createQuery } from './Query';
import { createWorld } from './World';

const Velocity = defineComponent({
   x: 0,
   y: 0,
});

const Name = defineComponent({
   value: '',
});

const Bounds = defineComponent({
   width: 0,
   height: 0,
});

const Player = createEntity([
   Velocity.new(),
   Name.new({
      value: 'Player',
   }),
]);

const Box = createEntity([
   Name.new({
      value: 'Box',
   }),
   Bounds.new({
      height: 250,
      width: 200,
   }),
]);

const world = createWorld();

world.insert(Player);
world.insert(Box);

const NameQuery = createQuery(Name);
const BoundsQuery = createQuery(Bounds);

console.log(NameQuery.execute(world));
console.log(BoundsQuery.execute(world));
