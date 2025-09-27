import type { UnitCommand } from "@fabfabper/simpledispatch-shared-models/typescript/UnitCommand";
import type { EventCommand } from "@fabfabper/simpledispatch-shared-models/typescript/EventCommand";

export type AnyCommand = UnitCommand | EventCommand;
