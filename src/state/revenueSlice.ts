import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { RevenueAppState, RevenueGroup, RevenueRule } from "./state";
import APIClient from "../model/APIClient";

const initialState: RevenueAppState = {
    current: { name: "", desc: "", special: false, rules: [] },
    groups: [],
    status: "idle",
};

export const fetchGroup = createAsyncThunk("revenue/fetchGroup", async () => {
    //const response = await client.get('/fakeApi/todos');
    const response = await new Promise((resolve, rejected) => {
        APIClient.send("https://api/revenue/get", {
            responseType: "json",
            onReturn: (response) => {
                resolve(response);
            },
            onError: (e) => {
                rejected(e);
            },
        });
    });

    return response as RevenueGroup[];
});

export const addGroup = createAsyncThunk(
    "revenue/addGroup",
    async (group: RevenueGroup) => {
        const response = await new Promise((resolve, rejected) => {
            APIClient.send("https://api/revenue/add", {
                responseType: "json",
                requestInit: {
                    headers: {
                        payload: JSON.stringify(group),
                    },
                },
                onReturn: (response) => {
                    resolve(response);
                },
                onError: (e) => {
                    rejected(e);
                },
            });
        });
        return response as RevenueGroup;
    }
);

export const removeGroup = createAsyncThunk(
    "revenue/removeGroup",
    async (index: number) => {
        const response = await new Promise((resolve, rejected) => {
            APIClient.send("https://api/revenue/remove", {
                responseType: "json",
                requestInit: {
                    headers: {
                        payload: index.toString(),
                    },
                },
                onReturn: (response) => {
                    resolve(response);
                },
                onError: (e) => {
                    rejected(e);
                },
            });
        });
        return response as RevenueGroup[];
    }
);

export const removeRule = createAsyncThunk(
    "revenue/removeRule",
    async (payload: { groupIndex: number; ruleIndex: number }) => {
        const response = await new Promise((resolve, rejected) => {
            APIClient.send("https://api/rule/remove", {
                responseType: "json",
                requestInit: {
                    headers: {
                        payload: JSON.stringify(payload),
                    },
                },
                onReturn: (response) => {
                    resolve(response);
                },
                onError: (e) => {
                    rejected(e);
                },
            });
        });
        return response as RevenueGroup[];
    }
);

export const revenueSlice = createSlice({
    name: "revenue",
    initialState,
    reducers: {
        setName: (
            state,
            action: PayloadAction<{ group?: string; name: string }>
        ) => {
            const { group: name, name: newName } = action.payload;
            if (name) {
                const match = state.groups.find((group) => group.name === name);
                match && (match.name = newName);
            } else {
                state.current.name = newName;
            }
        },
        setDesc: (
            state,
            action: PayloadAction<{ group?: string; desc: string }>
        ) => {
            const { group: name, desc: newDesc } = action.payload;
            if (name) {
                const match = state.groups.find((group) => group.name === name);
                match && (match.desc = newDesc);
            } else {
                state.current.desc = newDesc;
            }
        },
        setSpecial: (
            state,
            action: PayloadAction<{ group?: string; special: boolean }>
        ) => {
            const { group: name, special } = action.payload;
            if (name) {
                const match = state.groups.find((group) => group.name === name);
                match && (match.special = special);
            } else {
                state.current.special = special;
            }
        },
        addRule: (state) => {
            state.current.rules.push({
                field: undefined,
                operator: undefined,
                revenue: undefined,
                parameter: [""],
            });
        },
        updateRule: (
            state,
            action: PayloadAction<{
                ruleIndex: number;
                info: Partial<RevenueRule>;
            }>
        ) => {
            const { ruleIndex: index, info } = action.payload;
            const rules = state.current.rules;
            if (rules[index]) {
                rules[index] = { ...rules[index], ...info };
            }
        },
        addParameter: (
            state,
            action: PayloadAction<{
                ruleIndex: number;
            }>
        ) => {
            const { ruleIndex: index } = action.payload;
            const rules = state.current.rules;
            if (rules[index]) {
                rules[index].parameter.push("");
            }
        },
        removeParameter: (
            state,
            action: PayloadAction<{
                ruleIndex: number;
                parameterIndex: number;
            }>
        ) => {
            const { ruleIndex: index, parameterIndex: paramIndex } =
                action.payload;
            const rules = state.current.rules;
            if (rules[index]) {
                rules[index].parameter.splice(paramIndex, 1);
            }
        },
        updateParameter: (
            state,
            action: PayloadAction<{
                ruleIndex: number;
                parameterIndex: number;
                value: string;
            }>
        ) => {
            const {
                ruleIndex: index,
                parameterIndex: paramIndex,
                value,
            } = action.payload;
            const rules = state.current.rules;
            if (rules[index]) {
                rules[index].parameter[paramIndex] = value;
            }
        },
        reset: (state, action: PayloadAction<RevenueAppState>) => {
            state = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroup.pending, (state) => {
                state.status = "get:waiting";
            })
            .addCase(fetchGroup.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.status = "idle";
            })
            .addCase(fetchGroup.rejected, (state) => {
                state.status = "get:failed";
            })
            .addCase(addGroup.pending, (state) => {
                state.status = "upload:waiting";
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                const group = action.payload;
                state.status = "idle";
                state.groups.push(group);
            })
            .addCase(addGroup.rejected, (state) => {
                state.status = "add:failed";
            })
            .addCase(removeGroup.pending, (state) => {
                state.status = "remove:waiting";
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                const group = action.payload;
                state.status = "idle";
                state.groups = group;
            })
            .addCase(removeGroup.rejected, (state) => {
                state.status = "remove:failed";
            })
            .addCase(removeRule.pending, (state) => {
                state.status = "remove:waiting";
            })
            .addCase(removeRule.fulfilled, (state, action) => {
                const group = action.payload;
                state.status = "idle";
                state.groups = group;
            })
            .addCase(removeRule.rejected, (state) => {
                state.status = "remove:failed";
            });
    },
});

export const {
    reset,
    setName,
    setDesc,
    setSpecial,
    addRule,
    updateRule,
    addParameter,
    updateParameter,
    removeParameter,
} = revenueSlice.actions;

export const selectRevenueGroups = (state: RootState) => state.revenue.groups;
export const selectRevenueStatus = (state: RootState) => state.revenue.status;
export const selectCurrentRevenue = (state: RootState) => state.revenue.current;
export default revenueSlice.reducer;
