import { defineComponent } from './Component';
import { createEntity } from './Entity';
import { createQuery } from './Query';
import { With, Without } from './Query/helpers';
import { createWorld } from './World';

const Velocity = defineComponent({
   x: 0,
   y: 0,
});

const Position = defineComponent({
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

const Color = defineComponent({
   value: [0, 0, 0, 0] as [number, number, number, number],
});

const Box = createEntity([
   Name.new({
      value: 'Box',
   }),
   Velocity.new({
      x: 5,
      y: 0,
   }),
   Bounds.new({
      width: 50,
      height: 50,
   }),
   Color.new({
      value: [75, 28, 152, 1],
   }),
   Position.new({
      x: 25,
      y: 25,
   }),
]);

const Thing = createEntity([
   Position.new(),
   Bounds.new(),
   Name.new({
      value: 'Thing',
   }),
]);

const world = createWorld();
world.insert(Box);
world.insert(Thing);

const VelocityQuery = createQuery(
   [Name], //
   With(Name, Position),
   Without(Color),
);

console.log(VelocityQuery.execute(world));

// const BoundsQuery = createQuery(Bounds);
// const ColorQuery = createQuery(Color);
// const PositionQuery = createQuery(Position);

// const world = createWorld();
// world.insert(Box);

// const movementSystem = () => {
//    const velocities = VelocityQuery.execute(world);
//    const positions = PositionQuery.execute(world);

//    for (let index = 0; index < positions.length; index += 1) {
//       const pos = positions[index];
//       const vel = velocities[index];

//       pos.x += vel.x;
//       pos.y += vel.y;
//    }
// };

// const drawSystem = (ctx: CanvasRenderingContext2D) => {
//    const bounds = BoundsQuery.execute(world);
//    const colors = ColorQuery.execute(world);
//    const positions = PositionQuery.execute(world);

//    for (let index = 0; index < positions.length; index += 1) {
//       ctx.fillStyle = `rgba(${colors[index].value[0]}, ${colors[index].value[1]}, ${colors[index].value[2]}), ${colors[index].value[3]}`;
//       ctx.fillRect(
//          positions[index].x, //
//          positions[index].y,
//          bounds[index].width,
//          bounds[index].height,
//       );
//    }
// };

// const canvas = document.createElement('canvas');
// canvas.width = 500;
// canvas.height = 500;
// document.body.appendChild(canvas);

// const context = canvas.getContext('2d')!;

// setInterval(() => {
//    context.clearRect(0, 0, canvas.width, canvas.height);
//    drawSystem(context);
//    movementSystem();
// }, 1000 / 60);
