# An Entity-Component-System inspired by Bevy Engine.

This was a challange for me, I have never created an ECS before and wanted to test myself. It doesn't provide `THE BEST PERFORMANCE` but I think it is easy to understand.

## Installation

```
npm install @kadiryazici/ecs
```

```
pnpm add @kadiryazici/ecs
```

```
yarn add @kadiryazici/ecs
```

## Demo

You can view a demo in `/demo/main.ts` and [Online](https://kadiryazici.github.io/ecs/)

## Components

To create component we use `defineComponent` function. This function can take `undefined` or a `function` that returns an `object` as parameter. The reason why parameter is a function is not to have reference issues with default states because when a component created, default values are placed if missing.

```ts
import { defineComponent } from '@kadiryazici/ecs';

const Velocity = defineComponent(() => ({
   x: 0,
   y: 0,
}));

// Can be used to tag entities, has no state.
const Player = defineComponent();
```

We created a component, now it's time to create an instance of it, then we will use it in Entities.

```ts
// if you give undefined or {}, Velocity will have default state { x: 0, y,: 0 }
const baseVelocity = Velocity.create();
baseVelocity.state; // { x: 0, y: 0 }

// You can override some default values
const baseVelocity = Velocity.create({ x: 50 });
baseVelocity.state; // { x: 50, y: 0 }
```

You can create a new component instance and state like this but we won't use them like that.

## Entities

Entities contain components for systems to query them. To create an entity we use `createEntity` function.

```ts
import { defineComponent, createEntity } from '@kadiryazici/ecs';

const Velocity = defineComponent(() => ({
   x: 0,
   y: 50,
}));

const Name = defineComponent(() => ({
   value: '',
}));

const Player = createEntity()
   .add(Velocity.create({ x: 25 }))
   .add(Name.create({ value: 'Player' }));
```

Nice! we have created an entity with Name and Velocity component.

But it is better to return it from a function not to create multiple references to the same state.

```ts
const createPlayer = () =>
   createEntity()
      .add(Velocity.create({ x: 25 }))
      .add(Name.create({ value: 'Player' }));
```

We can add or remove component after an entity created.

```ts
const Player = createPlayer();
Player.add(Name.create({ value: }));
Player.remove(Name);
```

## World

World is a store of entities. It stores every `unique` entity in a `Set`.

```ts
import { createWorld } from '@kadiryazici/ecs';

const world = createWorld();
```

To add an entity to our world we can use `add` function.

```ts
world
   .add(createPlayer());
   .add(
      createEntity()
         .add(Velocity.create())
         .add(Name.create({ value: 'Enemy' })),
   );
```

Nice! now we know how to create Entities, Worlds and Components, now it's time to learn how to create and run queries.

## Query

Queries filter a world of entities by given components and then return `States Tuple` of `Components` of found `Entities`.

You can mutate components' state after iterating query result, that's why components only accept object. It's for mutation references.

```ts
import { createQuery } from '@kadiryazici/ecs';

// This query will search for entities that has Name component, and will return an array of tuple: [name][].
const VelocityQuery = createQuery([Name]);

function somethingSystem() {
   /*
      query is an array of tuple of Name components: 
      
      [
         [{ value: 'Player' }],
         [{ value: 'Enemy' }],
      ]
   */
   const query = VelocityQuery.exec(world);

   for (const [name] of query) {
      name.value = 'Now your name is xXxMurdererxXx2010';
   }

   // You can use forEach too, it's just an array.
   // But personally I prefer for...of.
   query.forEach(([name]) => {
      name.value = 'Or you can use forEach, but for...of better.';
   });
}
```

You can search for multiple components as well.

```ts
import { createQuery } from '@kadiryazici/ecs';

const VelocityNameQuery = createQuery([Name, Velocity]);

function somethingSystem() {
   const query = VelocityNameQuery.exec(world);

   for (const [name, velocity] of query) {
      console.log(name.value);
      velocity.x += 3;
      velocity.y -= 3;
   }
}
```

### With

So far we only queried components we want to receive, what if we want to receive Name component of entities that has Velocity component.

For this we can use `With` modifier.

```ts
import { defineComponent, createQuery, With } from '@kadiryazici/ecs';

// Lets create a third component for our queries.
const Bounds = defineComponent(() => ({
   width: 0,
   height: 0,
}));

/*
   First parameter should always be a tuple/array of components we want to receive.
   Other parameters are just spread, you can give as much modifiers as you want.
*/
const NameQueryWithVelocity = createQuery([Name], With(Velocity));
```

`With` modifier can get infinite number of component arguments.

```ts
import { createQuery, With } from '@kadiryazici/ecs';

const NameQueryWithVelocity = createQuery([Name], With(Velocity, Bounds));

function somethingSystem() {
   const query = NameQueryWithVelocity.exec(world);
   for(const [name] of query) {
      ...
   }
}
```

Multiple received components and `With` modifier.

```ts
import { createQuery, With } from '@kadiryazici/ecs';

const NameBoundsQuery = createQuery([Name, Bounds], With(Velocity, SomeComponent));

function somethingSystem() {
   const query = NameBoundsQuery.exec(world);
   for (const [name, bounds] of query) {
      something(name.value);
      draw(bounds.width, bounds.height);
   }
}
```

If you want you can repeat modifiers, they will be merged when the query executes.

It will be `With(Shadow, Light, Foot, Head)`.

```ts
import { createQuery } from '@kadiryazici/ecs';

const Query = createQuery([Name, Velocity, Color], With(Shadow, Light), With(Foot, Head));
```

### Without

We know about `With` modifier and how to use it, what if we want to receive `Name` component of entities that don't have `Velocity` and `Bounds` component.

```ts
import { createQuery, Without, With } from '@kadiryazici/ecs';

const NameQuery = createQuery([Name], Without(Velocity, Bounds));

// Can be used multiple times as well
// Will be converted into `Without(Bounds, Velocity)`
const NameQuery = createQuery([Name], Without(Velocity), Without(Bounds));

// Can be mixed with With modifier.
const NameQuery = createQuery([Name], With(RigidBody, Velocity, Bounds), Without(Shadow));

function somethingSystem() {
   const query = NameQuery.exec(world);

   for (const [name] of query) {
      console.log(name.value);
   }
}
```

## Systems

Systems are just `functions` that run queries and manages their states. You actually learned how to create systems above.

Let's create a `System` that updates `Position` by `Velocity` of Entities that has `RigidBody` component but don't have `FixedBody`.

```ts
import { createQuery, With, Without, createWorld, createEntity } from '@kadiryazici/ecs';
import type { World } from '@kadiryazici/ecs';

const PositionVelocityQuery = createQuery([Position, Velocity], With(RigidBody), Without(FixedBody));

// Systems are just functions, you can pass them whatever you want.
function movementSystem(world: World, delta: number) {
   const query = PositionVelocityQuery.exec(world);

   for (const [position, velocity] of query) {
      position.x += velocity.x * delta;
      posiyion.y += velocity.y * delta;
   }
}

const world = createWorld();

world.add(
   createEntity()
      .add(Position.new({ x: 50, y: 75 }))
      .add(Velocity.new())
      .add(RigidBody.new()),
);

movementSystem(world, Game.getDeltaTime());
```

## Special Component `EntityId`

If you also want to receive `Entity ID` from query you can use this special component.

For example if you want to remove enemies that player shot you need to remove entity from the world.

```ts
import { EntityId, World} from '@kadiryazici/ecs';

const BulletPositionsQuery = createQuery([Position], With(Bullet));
const EnemyPositionsQuery = createQuery([Position, EntityId], With(Enemy));

function collisionSystem(world: World) {
   const bulletPositions = PlayerPositionQuery.exec(world);
   const enemyPositions = EnemyPositionsQuery.exec(world);

   for (const [bulletPosition] of bulletPositions) {
      for (const [enemyPosition, enemyEID] of enemyPositions) {
         if (isColliding(bulletPosition.value, enemyPosition.value)) {
            // Bullet hit th enemy, so we remove it.
            world.remove(enemyEID);
         }
      }
   }
}

function gameLoop() {
   ...
   somethingSystem();
   // you can make systems with arguments, you don't have to keep a reference to the world all the time.
   collisionSystem(world);
   ...

   gameLoop();
}
```

## Example Project
You can see a little complicated example in my other repo: [Bomberman Clone](https://github.com/kadiryazici/bomberman)