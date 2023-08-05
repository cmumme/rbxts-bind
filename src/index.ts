/*
	index.ts
	@author typechecked
	@date 8/5/2023

	The entry point for @rbxts/bind.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Reflect } from "@rbxts/experimental-reflect"
import Object from "@rbxts/object-utils"

// Types
type UnknownFunction = (...args: any) => any
type Methodify<T extends UnknownFunction, K extends object = { }> = (this: K, ...Arguments: Parameters<T>) => void

type GetSignalGeneric<C extends Signal<any>> = C extends Signal<infer T> ? T : unknown

interface Signal<T extends UnknownFunction = UnknownFunction> {
	Connect: (this: Signal<T>, func: T) => RBXScriptConnection,
	ConnectParallel: (this: Signal<T>, func: T) => RBXScriptConnection,
	Once: (this: Signal<T>, func: T) => RBXScriptConnection,
	Wait: (this: Signal<T>) => any
}

interface MethodDescriptor {
	dd: string
}

/**
 * Binds the target method to an event.
 * 
 * @param Signal The signal to bind this method to.
 * @returns Method Decorator
 */
export const BindMethod = <C extends Signal, T extends Methodify<UnknownFunction> = Methodify<GetSignalGeneric<C>>>(Signal: C) => {
	return <K extends string, V extends { [Key in K]: T }>(Target: V, Key: K, _: unknown) => {
		Reflect.defineMetadata("ts:bind:bindedsignal", Signal, Target, Key)
	}
}

export namespace Bind {
	export function Activate(Target: object) {
		const Metatable = getmetatable(Target) as object | undefined
		const Keys = Object.keys(
			Object.assign({ },
				Target,
				Metatable && Metatable,
				Metatable && "__index" in Metatable && Metatable["__index"]
			)
		) as unknown as string[] // If we're working with a class we need to add any metamethods or properties from the class instance's metatable.

		Keys.forEach((Key: string) => {
			if(!(Key in Target)) return
			const BindedSignal = Reflect.getMetadata("ts:bind:bindedsignal", Target, Key) as RBXScriptSignal | undefined
			const BindedMethod = (Target as Record<string, any>)[Key] as UnknownFunction // We don't methodify as we have to manually pass through this later down the line.
			if(BindedSignal === undefined) return

			BindedSignal.Connect((...Args: unknown[]) => {
				BindedMethod(Target, ...Args)
			})
		})
	}
}