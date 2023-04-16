import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { RevenueAppState, RevenueGroup, RevenueRule } from "./state";

const initialState: RevenueAppState = {
    current: { name: "", desc: "", special: false, rules: [] },
    groups: [],
    status: "idle",
};

export const fetchGroup = createAsyncThunk("revenue/fetchGroup", async () => {
    //const response = await client.get('/fakeApi/todos');
    const response = await new Promise((resolve) => {
        setTimeout(() => {
            resolve([]);
        }, 1000);
    });
    return response as RevenueGroup[];
});

export const addGroup = createAsyncThunk(
    "revenue/addGroup",
    async (group: RevenueGroup) => {
        // const response = await client.post("/fakeApi/todos", {
        //     todo: initialTodo,
        // });
        const response = await new Promise((resolve, rejected) => {
            setTimeout(() => {
                resolve(group);
            }, 1000);
        });
        return response as RevenueGroup;
    }
);

export const revenueSlice = createSlice({
    name: "revenue",
    initialState,
    reducers: {
        // addGroup: (state, action: PayloadAction<RevenueGroup>) => {
        //     state.groups.push(action.payload);
        // },
        removeGroup: (state, action: PayloadAction<string>) => {
            const name = action.payload;
            const match = state.groups.findIndex(
                (group) => group.name === name
            );
            state.groups.splice(match, 1);
        },
        removeRule: (
            state,
            action: PayloadAction<{ group?: string; ruleIndex: number }>
        ) => {
            const { group: name, ruleIndex: rule } = action.payload;
            if (name) {
                const match = state.groups.find((group) => group.name === name);
                match?.rules.splice(rule, 1);
            } else {
                state.current.rules?.splice(rule, 1);
            }
        },
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
                state.status = "loading";
            })
            .addCase(fetchGroup.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.status = "idle";
            })
            .addCase(fetchGroup.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(addGroup.pending, (state) => {
                state.status = "uploading";
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                const group = action.payload;
                state.status = "idle";
                state.groups.push(group);
            })
            .addCase(addGroup.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const {
    removeGroup,
    removeRule,
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
