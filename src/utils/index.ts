export function typeOf<T>(value: unknown, type: string): value is T {
   return Object.prototype.toString.call(value).slice(8, -1) === type;
}
