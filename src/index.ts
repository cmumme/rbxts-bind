/*
	index.ts
	@author typechecked
	@date 8/5/2023

	The entry point for @rbxts/bind.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

// Types
type UnknownFunction = (...args: any) => any

type GetSignalGeneric<C extends Signal<never>> = C extends Signal<infer T> ? T : unknown

interface Signal<T extends UnknownFunction = UnknownFunction> {
	Connect: (func: T) => RBXScriptConnection,
	Once: (func: T) => RBXScriptConnection,
	Wait: () => any
}

/**
 * Binds the target method to an event.
 * 
 * @param Signal The signal to bind this method to.
 * @returns Method Decorator
 */
export const BindMethod = <C extends Signal, T extends UnknownFunction = GetSignalGeneric<C>>(Signal: C) => {
	return <K extends string, V extends { [Key in K]: T }>(Target: V, Key: K, __: unknown) => {
		Signal.Connect(Target[Key])
	}
}