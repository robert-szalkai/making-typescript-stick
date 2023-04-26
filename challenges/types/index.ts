type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

// ---cut---

// Implement a type that evaluates to T if the type C is true or F if C is false.
type If<C, T, F> = C extends true ? T : F;

// Tests
type ifCases = [
  Expect<Equal<If<true, "apple", "pear">, "apple">>,
  Expect<Equal<If<false, "orange", 42>, 42>>
];

// LengthOfTuple<T>
// Implement a type that evaluates to a numeric type literal, equivalent to the length of a specified tuple type T
type LengthOfTuple<T> = T extends readonly any[] ? T["length"] : never;

// Tests
const Fruits = ["cherry", "banana"] as const;
type lengthTupleCases = [
  Expect<Equal<LengthOfTuple<[1, 2, 3]>, 3>>,
  Expect<NotEqual<LengthOfTuple<[1, 2, 3]>, 2>>,
  Expect<Equal<LengthOfTuple<typeof Fruits>, 2>>,
  Expect<Equal<LengthOfTuple<[]>, 0>>
];

// EndsWith<A, B>
// Implement a type that evaluates to true if the type A ends with the type B, otherwise false.
type EndsWith<A extends string, B extends string> = A extends `${any}${B}`
  ? true
  : false;

// Tests
type endsWithCases = [
  Expect<Equal<EndsWith<"ice cream", "cream">, true>>,
  Expect<Equal<EndsWith<"ice cream", "chocolate">, false>>
];

// Concat<A, B>
// Implement a type that concatenates two tuple types A, and B
type Concat<A extends any[], B extends any[]> = [...A, ...B];

// Tests
type concatCases = [
  Expect<Equal<Concat<[], []>, []>>,
  Expect<Equal<Concat<[], ["hello"]>, ["hello"]>>,
  Expect<Equal<Concat<[18, 19], [20, 21]>, [18, 19, 20, 21]>>,
  Expect<
    Equal<
      Concat<[42, "a", "b"], [Promise<boolean>]>,
      [42, "a", "b", Promise<boolean>]
    >
  >
];

// ReturnOf<F>
// Implement a type that emits the return type of a function type F
type ReturnOf<F> = F extends { (...args: any): infer R } ? R : never;

// Tests

const flipCoin = () => (Math.random() > 0.5 ? "heads" : "tails");
const rockPaperScissors = (arg: 1 | 2 | 3) => {
  return arg === 1
    ? ("rock" as const)
    : arg === 2
    ? ("paper" as const)
    : ("scissors" as const);
};

type returnOfCases = [
  // simple 1
  Expect<Equal<boolean, ReturnOf<() => boolean>>>,
  // simple 2
  Expect<Equal<123, ReturnOf<() => 123>>>,
  Expect<Equal<ComplexObject, ReturnOf<() => ComplexObject>>>,
  Expect<Equal<Promise<boolean>, ReturnOf<() => Promise<boolean>>>>,
  Expect<Equal<() => "foo", ReturnOf<() => () => "foo">>>,
  Expect<Equal<"heads" | "tails", ReturnOf<typeof flipCoin>>>,
  Expect<
    Equal<"rock" | "paper" | "scissors", ReturnOf<typeof rockPaperScissors>>
  >
];

type ComplexObject = {
  a: [12, "foo"];
  bar: "hello";
  prev(): number;
};

// Split<S, SEP>
// Implement a type that splits a string literal type S by a delimiter SEP, emitting a tuple type containing the string literal types for all of the “tokens”
type Split<
  S extends string,
  SEP extends string
> = S extends `${infer H}${SEP}${infer T}`
  ? [H, ...Split<T, SEP>]
  : S extends ""
  ? []
  : string extends S
  ? string[]
  : [S];

let x: Split<"Hi! How are you?", "">;

// Tests

type cases = [
  Expect<Equal<Split<"Hi! How are you?", "z">, ["Hi! How are you?"]>>,
  Expect<Equal<Split<"Hi! How are you?", " ">, ["Hi!", "How", "are", "you?"]>>,
  Expect<
    Equal<
      Split<"Hi! How are you?", "">,
      [
        "H",
        "i",
        "!",
        " ",
        "H",
        "o",
        "w",
        " ",
        "a",
        "r",
        "e",
        " ",
        "y",
        "o",
        "u",
        "?"
      ]
    >
  >,
  Expect<Equal<Split<"", "">, []>>,
  Expect<Equal<Split<"", "z">, [""]>>,
  Expect<Equal<Split<string, "whatever">, string[]>>
];

// IsTuple<T>
// Implement a type IsTuple, which takes an input type T and returns whether T is tuple type.
type IsTuple<T> = T extends readonly any[]
  ? [...T, any]["length"] extends T["length"]
    ? false
    : true
  : false;

// Tests
type isTupleCases = [
  Expect<Equal<IsTuple<[]>, true>>,
  Expect<Equal<IsTuple<[number]>, true>>,
  Expect<Equal<IsTuple<readonly [1]>, true>>,
  Expect<Equal<IsTuple<{ length: 1 }>, false>>,
  Expect<Equal<IsTuple<number[]>, false>>
];
