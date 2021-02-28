export type Maybe<T> = T | null | undefined;
export type GetArrayType<T extends any[]> = T extends (infer U)[] ? U : never;
