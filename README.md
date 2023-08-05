# @rbxts/bind
Utilities for binding functions to RBXScriptSignals (or similar) with a simple decorator, similar to @rbxts/proton's @Lifecycle decorator.

```ts
import { BindMethod, Bind } from "@rbxts/bind"
import { RunService } from "@rbxts/services"

export class WorldGeneration {
    @BindMethod(RunService.Heartbeat)
    public OnHeartbeat(DeltaTime: number) {
        // ...
    }

    constructor() {
        Bind.Activate(this)
    }
}
```