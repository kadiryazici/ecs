import type { DefaultStateType } from '.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeComponentState = <State extends DefaultStateType>(
   defaultState: State,
   state: Partial<State> = {},
): State => {
   const def = Object.preventExtensions({ ...defaultState });

   for (const key of Object.keys(state)) {
      if (Object.prototype.hasOwnProperty.call(def, key)) {
         def[key as keyof State] = state[key as keyof State]!;
      }
   }

   return def;
};
