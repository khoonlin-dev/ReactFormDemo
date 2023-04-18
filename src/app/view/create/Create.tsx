/* eslint-disable @typescript-eslint/no-misused-promises */
import { OperatorEnum, RevenueGroup, RevenueRule } from "../../../state/state";
import { useCallback, useRef } from "react";
import "../../style/create/Create.scss";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { addGroup, selectRevenueStatus } from "../../../state/revenueSlice";

import {
    useForm,
    SubmitHandler,
    SubmitErrorHandler,
    Merge,
    FieldError,
    FieldErrorsImpl,
} from "react-hook-form";
import TextAreaWithCounter from "./TextAreaWithCounter";
import RulesBody from "./Rules";
import CreateFooter from "./Footer";

interface CreateViewProps {
    fieldList: string[];
    operatorList: OperatorEnum[];
    maxDescLength: number;
}

function validateRule(
    rule: Merge<
        FieldError,
        FieldErrorsImpl<{
            field: string;
            operator: OperatorEnum;
            parameter: string[];
            revenue: number;
        }>
    >
) {
    const { operator, field, revenue, parameter } = rule;
    let errorComp = undefined;
    let error = undefined;
    switch (true) {
        case operator !== undefined: {
            errorComp = "operator";
            error = operator?.type;
            break;
        }
        case field !== undefined: {
            errorComp = "field";
            error = field?.type;
            break;
        }
        case revenue !== undefined: {
            errorComp = "revenue";
            error = revenue?.type;
            break;
        }
        case parameter !== undefined: {
            if (Array.isArray(parameter) && parameter[0]) {
                //
                const { ref, type } = parameter[0] as FieldError;
                errorComp = ref ? ref.name : "parameter";
                error = type;
            } else {
                errorComp = "parameter";
                error = parameter?.type || "unknown";
            }
            break;
        }
        default:
            break;
    }
    return { errorComp, error };
}

/**
 * Views based on form data as state in order to avoid unnecessary
 * re-rendering of whole form or section and serve as
 * single source-of-truth for a "simulated" controlled inputs
 * @param props
 * @returns
 */
export default function CreateView(props: CreateViewProps) {
    const { fieldList, operatorList, maxDescLength } = props;
    const status = useAppSelector(selectRevenueStatus);
    const dispatch = useAppDispatch();
    const disabled = status.endsWith(":waiting");

    const {
        register,
        handleSubmit,
        unregister,
        getValues,
        setValue,
        reset,
        setError,
        clearErrors,
    } = useForm<RevenueGroup>({ mode: "onSubmit" });

    const formRef = useRef<HTMLFormElement>();

    const onSubmit: SubmitHandler<RevenueGroup> = useCallback(
        async function (data: RevenueGroup) {
            const rulesComparison: Record<string, RevenueRule> = {};
            // Transform data
            for (let i = 0; i < data.rules.length; i++) {
                const rule = data.rules[i];

                rule.parameter = rule.parameter.filter(
                    (param) => param !== undefined && param !== ""
                );

                // Remove duplicated rules
                // We are sorting params here for comparison purpose.
                const sortedParam = rule.parameter.slice().sort();
                const meta = `${rule.field}:${rule.operator}:${sortedParam.join(
                    ":"
                )}`;
                if (Object.keys(rulesComparison).indexOf(meta) === -1) {
                    rulesComparison[meta] = rule;
                }
            }
            data.rules = Object.values(rulesComparison);
            await dispatch(addGroup(data))
                .then((c) => {
                    const { error } = c as { error?: Error };
                    if (error) {
                        throw error;
                    }
                    formRef.current?.reset();
                })
                .catch((_e: Error) => {
                    alert(`Submit failed. Please try again later`);
                });
        },
        [dispatch]
    );

    const onInvalid: SubmitErrorHandler<RevenueGroup> = useCallback(
        ({ name, desc, rules, special }) => {
            let errorComp = undefined;
            let error = undefined;
            switch (true) {
                case name !== undefined: {
                    errorComp = "name";
                    error = name?.type || "unknown";
                    break;
                }
                case desc !== undefined: {
                    errorComp = "desc";
                    error = desc?.type || "unknown";
                    break;
                }
                case rules !== undefined: {
                    if (Array.isArray(rules) && rules[0]) {
                        const validate = validateRule(
                            rules[0] as Merge<
                                FieldError,
                                FieldErrorsImpl<{
                                    field: string;
                                    operator: OperatorEnum;
                                    parameter: string[];
                                    revenue: number;
                                }>
                            >
                        );
                        errorComp = validate.errorComp;
                        error = validate.error;
                    } else {
                        errorComp = "rules";
                        error = rules?.type || "unknown";
                    }
                    break;
                }
                case special !== undefined: {
                    errorComp = "special";
                    error = special?.type || "unknown";
                    break;
                }
                default: {
                    errorComp = "unknown";
                    error = "unknown";
                }
            }
            alert(
                `Error: "${errorComp || "unknown"}" field has "${
                    error || "unknown"
                }" error`
            );
        },
        []
    );

    const customValidation = useCallback(() => {
        const rules = getValues("rules");
        if (rules === undefined || rules.length === 0) {
            setError("rules", {
                type: "no rules",
            });
        } else {
            clearErrors("rules");
            for (let i = 0; i < rules.length; i++) {
                const { parameter } = rules[i];
                const legitParams = parameter.filter(
                    (param) => param !== undefined && param !== ""
                );
                if (legitParams.length === 0) {
                    setError(`rules.${i}.parameter`, {
                        type: "need at least one legit parameter",
                    });
                    break;
                } else {
                    clearErrors(`rules.${i}.parameter`);
                }
            }
        }
    }, [clearErrors, getValues, setError]);

    return (
        <div className="create-view">
            <div className="view-title">Create Revenue Group</div>
            <form
                className="create-form"
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                onReset={() => {
                    reset({
                        name: "",
                        desc: "",
                        special: false,
                        rules: [],
                    });
                }}
                ref={formRef as React.LegacyRef<HTMLFormElement>}
            >
                <div className="input-section">
                    <label htmlFor="name" className="form-label">
                        Group Name
                    </label>
                    <input
                        {...register("name", { required: true })}
                        id="name"
                        name="name"
                        className="form-text-input"
                        type="text"
                        placeholder="Name"
                        disabled={disabled}
                    ></input>
                </div>
                <div className="input-section">
                    <TextAreaWithCounter
                        register={register}
                        unregister={unregister}
                        getValues={getValues}
                        required
                        label="desc"
                        textAreaProps={{
                            className: "form-text-input",
                            maxLength: maxDescLength,
                            placeholder: "Add description",
                            disabled,
                            style: { height: "80px" },
                        }}
                        changeColorWhenFull={true}
                    ></TextAreaWithCounter>
                </div>
                <div className="special-checkbox-holder">
                    <input
                        {...register("special")}
                        type="checkbox"
                        id="special"
                        name="special"
                        disabled={disabled}
                    ></input>
                    <label className="special-checkbox-label" htmlFor="special">
                        Special Group
                    </label>
                </div>
                <RulesBody
                    fieldList={fieldList}
                    operatorList={operatorList}
                    disabled={disabled}
                    register={register}
                    unregister={unregister}
                    getValues={getValues}
                    setValue={setValue}
                />
                <CreateFooter disabled={disabled} onClick={customValidation} />
            </form>
        </div>
    );
}
