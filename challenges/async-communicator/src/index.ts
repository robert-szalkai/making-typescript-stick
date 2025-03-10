import { expectType } from "tsd";

// IMPLEMENT THIS TYPE
export type WrapForPenpal<T> = {
  [K in keyof T]: T[K] extends { (...args: infer Args): infer R }
    ? R extends Promise<any>
      ? (...args: Args) => R // R is already a Promise
      : (...args: Args) => Promise<R>
    : T[K]; // non-method things
};

/**
 * Test Scenario - Do not change anything below this line
 */
const methods = {
  foo: 7,
  add(a: number, b: number): number {
    return a + b;
  },
  doAsyncThing(a: number, b: number): Promise<number> {
    return Promise.resolve(a + b);
  },
  subtract(a: number, b: number): number {
    return a - b;
  },
};
const asyncMethods: WrapForPenpal<typeof methods> = {} as any;

asyncMethods.foo;
let addPromise1 = asyncMethods.doAsyncThing(1, 2);
let addPromise = asyncMethods.add(1, 2);
expectType<Promise<number>>(addPromise);
// @ts-expect-error
expectType<typeof addPromise>("this should fail");

let subtractPromise = asyncMethods.subtract(1, 2);
expectType<Promise<number>>(subtractPromise);
// @ts-expect-error
expectType<typeof subtractPromise>("this should fail");
