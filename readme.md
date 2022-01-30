# An Entity-Component-System inspired by Bevy Engine.

This was a challange for me, I have never created an ECS before and wanted to test myself. It doesn't provide `THE BEST PERFORMANCE` but I think it is easy to understand.

## Components
To create component we use `defineComponent` function. This function can take `undefined` or an `object` as parameter. Given object is always default state.
```ts
const Velocity = defineComponent({
   x: 0,
   y: 0,
});
```
We created a component, now it's time to create an instance of it, then we will use it in Entities.
```ts
// if you give undefined or {}, Velocity will have default state {x: 0, y,: 0}
const baseVelocity = Velocity.new() 
baseVelocity.state // { x: 0, y: 0 }

// You can override some default values

const baseVelocity = Velocity.new({ x: 50 });
baseVelocity.state // { x: 50, y: 0 }
```
You can create a new component instance and state like this but we won't use them like that.

## Entities
Entities are `entities` that hold bunch of components. To create an entity we use `createEntity` function. This function can take an array of components.

```ts
const Velocity = defineComponent({
   x: 0,
   y: 50
});

const Name = defineComponent({
   value: ''
});

const Player = createEntity([
   Velocity.new({ x: 25 }),
   Name.new({ value: 'Player' }),
]);
```
Nice! we have created an entity with Name and Velocity component.

But it is better to return it from a function not to create multiple references to the same state.
```ts
const createPlayer = () => createEntity([
   Velocity.new({ x: 25 }),
   Name.new({ value: 'Player' }),
]);
```
We can add or remove component after an entity created.
```ts
const Player = createPlayer();
Player.insert(Name.new({ value: }));
Player.remove(Name);
```

## World

World is a `world` that holds entities.
```ts
const world = createWorld();
```
To add an entity to our world we can use `insert` function.
```ts
world.insert(createPlayer());
world.insert(createEntity([
   Velocity.new(),
   Name.new({ value: 'Enemy' })
]))
```

Nice! now we know how to create Entities, Worlds and Components, now it's time to learn how to create a system and create a query.

## Query
Queries are `queries` that filter by components in given world and then return `States Tuple` of `Components` of found `Entities`.

```ts
// This query will search for entities that has Name component, and will return an array of [name];
const VelocityQuery = createQuery([Name]);
const updateVelocities = () => {
   /*
      query is an array of tuple of Name components: 
      
      [
         [{ value: 'Player' }],
         [{ value: 'Enemy' }],
      ]
   */
   const query = VelocityQuery.exec(world);
   
   for(const [ name ] of query) {
      doSomething(name.value);
   }
}
```

You can search for multiple components as well.

```ts
const VelocityNameQuery = createQuery([Name, Velocity]);
const doSomething = () => {
   const query = VelocityNameQuery.exec(world);

   for(const [name, velocity] of query) {
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
// Lets create a third component for our queries.
const Bounds = defineComponent({
   width: 0,
   height: 0,
});

/*
   First parameter should always be a tuple of components we want to receive.
   Other parameters are just spread, you can give as much modifiers as you want.
*/
const NameQueryWithVelocity = createQuery([Name], With(Velocity))
```

With modifier can have infinite number of components.
```ts
const NameQueryWithVelocity = createQuery([Name], With(Velocity, Bounds, SometComponent));
const doSomething = () => {
   const query = NameQueryWithVelocity.exec(world);
   for(const [name], of query) {
      ...
   }
}
```

Multiple received components and `With` modifier.
```ts
const NameBoundsQuery = createQuery([Name, Bounds], With(Velocity, SomeComponent));
const doSomething = () => {
   const query = NameBoundsQuery.exec(world);
   for(const [name, bounds], of query) {
      something(name.value);
      draw(
         bounds.width,
         bounds.height
      )
   }
}
```

If you want you can repeat modifiers, they will be merged when the query executes.
```ts
const Query = createQuery(
   [Name, Velocity, Color],
   With(Shadow, Light),
   With(Foot, Head)
)
```
### Without
We know about `With` modifier and how to use it, what if we want to receive `Name` component of entities that don't have `Velocity` and `Bounds` component.

```ts
const NameQuery = createQuery(
   [Name],
   Without(Velocity, Bounds)
)

// Can be used multiple times as well
const NameQuery = createQuery(
   [Name],
   Without(Velocity),
   Without(Bounds)
)

// Can be mixed with With modifier.
const NameQuery = createQuery(
   [Name],
   With(RigidBody, Velocity, Bounds),
   Without(Shadow)
)

const doSomething = () => {
   const query = NameQuery.exec(world);

   for(const [name] of query) {
      console.log(name.value);
   }
}
```

## Systems
Systems are just `functions` that run queries and manages its states'. You actually learned how to create systems above in Query section.

Let's create a `System` that updates `Position` by `Velocity` of Entities that has `RigidBody` component but don't have `FixedBody`. 

```ts
const PositionVelocityQuery = createQuery(
   [Position, Velocity],
   With(RigidBody),
   Without(FixedBody)
);

const movementSystem = (world) => {
   const query = PositionVelocityQuery.exec(world);

   for(const [position, velocity] of query) {
      position.x += velocity.x;
      posiyion.y += velocity.y;
   }
}

const world = createWorld();
world.insert(createEntity([
   Position.new({ x: 50, y: 75 }),
   Velocity.new(),
   RigidBody.new()
]))

movementSystem(world);
```

## Example
Now we know concepts, lets create a sample project that draws rectangles to canvas and updates their positions by velocities.

```ts
// Lets get our canvas and context.
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// Create components we need.
const Position = defineComponent({
   x: 0,
   y: 0
});

const Velocity = defineComponent({
   x: 0,
   y: 0,
});

const Bounds = defineComponent({
   width: 0,
   height: 0,
});

const Color = defineComponent({
   value: '#000',
});

// A helper function to create a box.
const createBox = (x = 0, y = 0) => createEntity([
   Velocity.new({ y: 25 }),
   Position.new({x, y}),
   Bounds.new({
      width: 50,
      height: 50,
   }),
   Color.new({
      value: 'rgb(152, 93, 115)',
   }),
]);

const world = createWorld();

world.insert(createBox(50, 75));
world.insert(createBox(150, 125));

// A MovementSystem that updates positions by velocity.
const MovementQuery = createQuery([Position, Velocity], With(Bounds))
const movementSystem = () => {
   const query = MovementQuery.exec(world);

   for(const [position, velocity] of query) {
      position.x += velocity.x;
      position.y += velocity.y;
   }
}

// A Draw system that draws boxes to canvas.
const DrawQuery = createQuery([Position, Bounds, Color]);
const drawSystem = () => {
   const query = DrawQuery.exec(world);
   
   for(const [pos, bounds, color] of query) {
      context.fillStyle = color.value;
      context.fillRect(
         pos.x,
         pos.y,
         bounds.width,
         bound.height
      )
   }
}

setInterval(() => {
   movementSystem(ctx);
   drawSystem();
}, 1000 / 60)
```