// Enum is for data transfer
export enum OperatorEnum {
    IS = 1,
    ISNOT,
    STARTSW,
    NSTARTSW,
    ENDSW,
    NENDSW,
    CONTAINS,
    NCONTAINS,
}

// Localized map is for display
export const LocalizedOperator = {
    [OperatorEnum.IS]: "is",
    [OperatorEnum.ISNOT]: "is not",
    [OperatorEnum.STARTSW]: "starts with",
    [OperatorEnum.NSTARTSW]: "doesn't start with",
    [OperatorEnum.ENDSW]: "ends with",
    [OperatorEnum.NENDSW]: "doesn't end with",
    [OperatorEnum.CONTAINS]: "contains",
    [OperatorEnum.NCONTAINS]: "doesn't contains",
};

export interface RevenueRule {
    field: string;
    operator: OperatorEnum;
    parameter: string[];
    revenue: number;
}

export interface RevenueGroup {
    name: string;
    desc: string;
    special: boolean;
    rules: RevenueRule[];
}

export interface RevenueAppState {
    current: RevenueGroup & { rules: Partial<RevenueRule>[] };
    groups: RevenueGroup[];
    status:
        | "idle"
        | "get:waiting"
        | "upload:waiting"
        | "remove:waiting"
        | "add:failed"
        | "get:failed"
        | "remove:failed";
}

export interface RevenueAppAction {
    addGroup: { type: "create/groupAdded"; payload: RevenueGroup };
    removeGroup: { type: "browse/groupRemoved"; payload: string };
    removeRule: {
        type: "browse/ruleRemoved";
        payload: { group: string; rule: number };
    };
    // For error recovery purpose
    reset: { type: "app/reset"; payload: RevenueAppState };
}
