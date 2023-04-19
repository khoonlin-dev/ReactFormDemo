import { act } from "react-dom/test-utils";
import { vi } from "vitest";

import revenueReducer, {
    reset,
    setName,
    setDesc,
    setSpecial,
    addRule,
    addParameter,
    updateParameter,
    updateRule,
} from "../src/state/revenueSlice";
import { RevenueAppState, OperatorEnum } from "../src/state/state";

describe("current state test", () => {
    const initialState: RevenueAppState = {
        current: { name: "", desc: "", special: false, rules: [] },
        groups: [],
        status: "get:waiting",
    };
    it("should handle initial state", () => {
        expect(revenueReducer(undefined, { type: "unknown" })).toEqual({
            current: { name: "", desc: "", special: false, rules: [] },
            groups: [],
            status: "get:waiting",
        });
    });

    it("should handle set current name", () => {
        const actual = revenueReducer(
            initialState,
            setName({
                name: "fake_name",
            })
        );
        expect(actual.current.name).toEqual("fake_name");
    });

    it("should handle set current desc", () => {
        const actual = revenueReducer(
            initialState,
            setDesc({
                desc: "fake_desc",
            })
        );
        expect(actual.current.desc).toEqual("fake_desc");
    });

    it("should handle reset state", () => {
        const actual = revenueReducer(
            initialState,
            reset({
                current: {
                    name: "fake_name",
                    desc: "fake_desc",
                    special: true,
                    rules: [],
                },
                status: "idle",
                groups: [],
            })
        );
        expect(actual).toEqual({
            current: {
                name: "fake_name",
                desc: "fake_desc",
                special: true,
                rules: [],
            },
            status: "idle",
            groups: [],
        });
    });

    it("should handle update current special", () => {
        const actual = revenueReducer(
            initialState,
            setSpecial({
                special: true,
            })
        );
        expect(actual.current.special).toEqual(true);
    });

    it("should be able to add new rule to current state", () => {
        const actual = revenueReducer(initialState, addRule());
        expect(actual.current.rules.length).toEqual(1);
    });

    it("should be able to add new parameter to certain current rule", () => {
        const actual = revenueReducer(
            {
                current: {
                    name: "",
                    desc: "",
                    special: false,
                    rules: [
                        {
                            field: "",
                            operator: OperatorEnum.CONTAINS,
                            revenue: 0,
                            parameter: [],
                        },
                    ],
                },
                groups: [],
                status: "get:waiting",
            },
            addParameter({ ruleIndex: 0 })
        );
        expect(actual.current.rules[0].parameter.length).toEqual(1);
    });

    it("should be able to update existing current rule", () => {
        const actual = revenueReducer(
            {
                current: {
                    name: "",
                    desc: "",
                    special: false,
                    rules: [
                        {
                            field: "",
                            operator: OperatorEnum.CONTAINS,
                            revenue: 0,
                            parameter: ["old_param"],
                        },
                    ],
                },
                groups: [],
                status: "get:waiting",
            },
            updateParameter({
                ruleIndex: 0,
                parameterIndex: 0,
                value: "new_param",
            })
        );
        expect(actual.current.rules[0].parameter[0]).toEqual("new_param");
    });

    it("should be able to update existing parameter to certain current rule", () => {
        const actual = revenueReducer(
            {
                current: {
                    name: "",
                    desc: "",
                    special: false,
                    rules: [
                        {
                            field: "",
                            operator: OperatorEnum.CONTAINS,
                            revenue: 0,
                            parameter: ["old_param"],
                        },
                    ],
                },
                groups: [],
                status: "get:waiting",
            },
            updateRule({
                ruleIndex: 0,
                info: {
                    revenue: 15,
                    field: "new_field",
                    operator: OperatorEnum.IS,
                    parameter: ["new_param"],
                },
            })
        );
        expect(actual.current.rules[0].revenue).toEqual(15);
        expect(actual.current.rules[0].field).toEqual("new_field");
        expect(actual.current.rules[0].operator).toEqual(OperatorEnum.IS);
        expect(actual.current.rules[0].parameter[0]).toEqual("new_param");
    });
});
