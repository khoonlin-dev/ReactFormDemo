/* eslint-disable @typescript-eslint/no-misused-promises */
import {
    LocalizedOperator,
    OperatorEnum,
    RevenueGroup,
    RevenueRule,
} from "../../state/state";
import React from "react";
import "./Create.scss";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
    addGroup,
    selectRevenueGroups,
    selectRevenueStatus,
} from "../../state/revenueSlice";

//TODO: Cannot pick the same operator between rules

import {
    Path,
    useForm,
    UseFormRegister,
    SubmitHandler,
    UseFormUnregister,
    UseFormGetValues,
    UseFormSetValue,
    SubmitErrorHandler,
    Merge,
    FieldError,
    FieldErrorsImpl,
    UseFormSetError,
    UseFormClearErrors,
} from "react-hook-form";
import { ReactHookUtils } from "../../utils/ReactHookUtils";

type InputProps = {
    label: Path<RevenueGroup>;
    register: UseFormRegister<RevenueGroup>;
    required: boolean;
};

interface CreateViewProps {
    fieldList: string[];
    operatorList: OperatorEnum[];
    maxDescLength: number;
}

interface RulesViewProps {
    index: number;
    fieldList: string[];
    operatorList: OperatorEnum[];
    onRemoveRule: () => void;
    disabled: boolean;
}

interface RulesBodyProps {
    fieldList: string[];
    operatorList: OperatorEnum[];
    disabled: boolean;
}

// The following component is an example of your existing Input Component
const TextAreaWithCounter = ({
    label: id,
    register,
    required,
    textAreaProps,
}: InputProps & { unregister: UseFormUnregister<RevenueGroup> } & {
    getValues: UseFormGetValues<RevenueGroup>;
} & {
    textAreaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    changeColorWhenFull: boolean;
}) => {
    const [length, setLength] = React.useState(
        (textAreaProps.value || textAreaProps.defaultValue)?.toString()
            ?.length || 0
    );
    const customRef = React.useRef<HTMLTextAreaElement>();
    const { ref, ...rest } = register(id, { required });
    React.useEffect(() => {
        const current = customRef.current;
        if (current) {
            current.oninput = () => {
                setLength(current.value?.length || 0);
            };
        }
    }, []);
    return (
        <>
            <label htmlFor={textAreaProps.id} className="form-label">
                {"Group Description"}
            </label>
            <div style={{ position: "relative" }}>
                <textarea
                    {...textAreaProps}
                    id={id}
                    {...rest}
                    ref={(e) => {
                        ref(e);
                        customRef.current = e as HTMLTextAreaElement; // you can still assign to ref
                    }}
                ></textarea>
                {textAreaProps.maxLength ? (
                    <div
                        style={{
                            textAlign: "end",
                            position: "absolute",
                            width: "99%",
                            bottom: "2%",
                        }}
                    >{`${length}/${textAreaProps.maxLength}`}</div>
                ) : undefined}
            </div>
        </>
    );
};

function RulesBody({
    register,
    unregister,
    getValues,
    setValue,
    fieldList,
    operatorList,
    disabled,
}: {
    register: UseFormRegister<RevenueGroup>;
    unregister: UseFormUnregister<RevenueGroup>;
    getValues: UseFormGetValues<RevenueGroup>;
    setValue: UseFormSetValue<RevenueGroup>;
    setError: UseFormSetError<RevenueGroup>;
    clearErrors: UseFormClearErrors<RevenueGroup>;
} & RulesBodyProps) {
    // Views based on form data as state in order to avoid unnecessary re-rendering and serve as single source-of-truth

    const forceUpdate = ReactHookUtils.useForceUpdate();
    const ref = React.useRef<Partial<RevenueRule>[]>([]);

    ref.current = getValues(`rules`) || [];

    return (
        <>
            <div className="rules-header">
                <div style={{ alignSelf: "center" }}>Rules</div>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        ref.current = getValues(`rules`) || [];
                        ref.current.push({
                            field: undefined,
                            operator: undefined,
                            revenue: undefined,
                            parameter: [""],
                        });
                        setValue(`rules`, ref.current as RevenueRule[]);
                        forceUpdate();
                    }}
                >
                    Add
                </button>
            </div>
            <div className="rules-body">
                {ref.current.map((rule, i) => {
                    return (
                        <RulesContainerView
                            key={`rules-container-${i}`}
                            index={i}
                            register={register}
                            unregister={unregister}
                            getValues={getValues}
                            setValue={setValue}
                            fieldList={fieldList}
                            operatorList={operatorList}
                            disabled={disabled}
                            onRemoveRule={() => {
                                ref.current = getValues(`rules`);
                                console.log(`Before deleted. Rules is now`);
                                console.log(getValues(`rules`));
                                ref.current.splice(i, 1);
                                setValue(`rules`, ref.current as RevenueRule[]);
                                console.log(`Deleted. Rules is now`);
                                console.log(getValues(`rules`));

                                forceUpdate();
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}

function ParameterView({
    disabled,
    rulesId,
    getValues,
    setValue,
    register,
}: {
    disabled: boolean;
    rulesId: number;
    register: UseFormRegister<RevenueGroup>;
    unregister: UseFormUnregister<RevenueGroup>;
    getValues: UseFormGetValues<RevenueGroup>;
    setValue: UseFormSetValue<RevenueGroup>;
}) {
    // Views based on form data as state in order to avoid unnecessary re-rendering and serve as single source-of-truth

    const ref = React.useRef<string[]>(getValues(`rules.${rulesId}.parameter`));
    const forceUpdate = ReactHookUtils.useForceUpdate();

    ref.current = getValues(`rules.${rulesId}.parameter`);

    return (
        <div className="parameter-holder">
            {ref.current.map((param, i, arr) => {
                if (i === 0) {
                    return (
                        <div
                            className="parameter-list"
                            key={`parameter-list-${i}-${
                                ref.current?.[i] || ""
                            }`}
                        >
                            <input
                                className="parameter-input"
                                disabled={disabled}
                                type="text"
                                defaultValue={param}
                                placeholder="Enter parameter"
                                {...register(
                                    `rules.${rulesId}.parameter.${i}`,
                                    {
                                        onBlur: (
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            ref.current[i] = e.target.value;
                                            console.log(ref.current);
                                        },
                                    }
                                )}
                            ></input>
                            <button
                                type="button"
                                disabled={arr.length === 3 || disabled}
                                onClick={() => {
                                    ref.current =
                                        getValues(
                                            `rules.${rulesId}.parameter`
                                        ) || [];
                                    ref.current.push("");
                                    forceUpdate();
                                }}
                                style={{
                                    width: "5%",
                                    opacity: arr.length < 3 ? 1 : 0,
                                }}
                            >
                                +
                            </button>
                        </div>
                    );
                } else {
                    return (
                        <div
                            className="parameter-list"
                            key={`parameter-list-${i}-${ref.current[i]}`}
                        >
                            <input
                                disabled={disabled}
                                type="text"
                                className="parameter-input"
                                defaultValue={param}
                                placeholder="Enter parameter"
                                {...register(
                                    `rules.${rulesId}.parameter.${i}`,
                                    {
                                        onBlur: (
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            ref.current[i] = e.target.value;
                                            console.log(ref.current);
                                        },
                                    }
                                )}
                            ></input>
                            <button
                                type="button"
                                disabled={disabled}
                                style={{ width: "5%" }}
                                onClick={() => {
                                    ref.current = getValues(
                                        `rules.${rulesId}.parameter`
                                    );
                                    ref.current.splice(i, 1);
                                    setValue(
                                        `rules.${rulesId}.parameter`,
                                        ref.current
                                    );
                                    // console.log(
                                    //     `Deleted. Parameters is now ${getValues(
                                    //         `rules.${rulesId}.parameter`
                                    //     ).join(",")}`
                                    // );
                                    forceUpdate();
                                }}
                            >
                                -
                            </button>
                        </div>
                    );
                }
            })}
        </div>
    );
}

function RulesContainerView({
    fieldList,
    operatorList,
    disabled,
    register,
    unregister,
    getValues,
    setValue,
    index,
    onRemoveRule,
}: RulesViewProps & {
    register: UseFormRegister<RevenueGroup>;
    unregister: UseFormUnregister<RevenueGroup>;
    getValues: UseFormGetValues<RevenueGroup>;
    setValue: UseFormSetValue<RevenueGroup>;
}) {
    // Views based on form data as state in order to avoid unnecessary re-rendering and serve as single source-of-truth
    return (
        <div className="rules-outer-container">
            <div className="rules-inner-container-header">
                <div>{`Rule ${index + 1}`}</div>{" "}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onRemoveRule();
                    }}
                >
                    -
                </button>
            </div>
            <div className="rules-inner-container">
                <div>If</div>
                <select
                    disabled={disabled}
                    placeholder="Select field"
                    id={`rules.${index}.field`}
                    {...register(`rules.${index}.field`, { required: true })}
                    style={{ height: "fit-content", width: "20%" }}
                >
                    <>
                        {fieldList.map((fieldOption) => {
                            return (
                                <option
                                    key={`field-option-${fieldOption}`}
                                    value={fieldOption}
                                >
                                    {fieldOption}
                                </option>
                            );
                        })}
                    </>
                </select>
                <select
                    disabled={disabled}
                    placeholder="Select operator"
                    id={`rules.${index}.operator`}
                    {...register(`rules.${index}.operator`, { required: true })}
                    style={{ height: "fit-content", width: "20%" }}
                >
                    <>
                        {operatorList.map((operatorOption) => {
                            return (
                                <option
                                    key={`operator-option-${operatorOption}`}
                                    value={operatorOption}
                                >
                                    {LocalizedOperator[operatorOption]}
                                </option>
                            );
                        })}
                    </>
                </select>
                <ParameterView
                    disabled={disabled}
                    rulesId={index}
                    register={register}
                    unregister={unregister}
                    getValues={getValues}
                    setValue={setValue}
                ></ParameterView>
            </div>
            <div className="revenue-container">
                <label htmlFor="revenue" className="revenue-label">
                    then revenue is
                </label>
                <input
                    className="form-revenue-input"
                    type="number"
                    placeholder="% Enter amount"
                    disabled={disabled}
                    id={`rules.${index}.revenue`}
                    {...register(`rules.${index}.revenue`, {
                        required: true,
                        min: 0,
                        max: 100,
                        onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
                            const revenue = +e.target.value;
                            if (revenue > 100) {
                                setValue(`rules.${index}.revenue`, 100);
                            } else if (revenue < 0) {
                                setValue(`rules.${index}.revenue`, 0);
                            }
                        },
                    })}
                ></input>
            </div>
        </div>
    );
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

    const formRef = React.useRef<HTMLFormElement>();

    const onSubmit: SubmitHandler<RevenueGroup> = async function (data) {
        // Transform data
        for (let i = 0; i < data.rules.length; i++) {
            const rule = data.rules[i];
            rule.parameter = rule.parameter.filter(
                (param) => param !== undefined && param !== ""
            );
        }
        console.log("Uploading");
        //setDisabled(true);
        await dispatch(addGroup(data))
            .then((c) => {
                const { error } = c as { error?: Error };
                if (error) {
                    throw error;
                }
                formRef.current?.reset();
            })
            .catch((e: Error) => {
                alert(e.message);
            });
    };

    const onInvalid: SubmitErrorHandler<RevenueGroup> = ({
        name,
        desc,
        rules,
        special,
    }) => {
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
                console.log(rules);
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
    };

    return (
        <div className="create-view">
            <h1>Create Revenue Group</h1>
            <form
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
                <div>
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
                <div>
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
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-start",
                    }}
                >
                    <input
                        {...register("special")}
                        type="checkbox"
                        id="special"
                        name="special"
                        disabled={disabled}
                    ></input>
                    <label htmlFor="special">Special Group</label>
                </div>
                <RulesBody
                    fieldList={fieldList}
                    operatorList={operatorList}
                    disabled={disabled}
                    register={register}
                    unregister={unregister}
                    getValues={getValues}
                    setValue={setValue}
                    setError={setError}
                    clearErrors={clearErrors}
                />
                <button type="reset" disabled={disabled}>
                    Reset
                </button>
                <button
                    type="submit"
                    disabled={disabled}
                    onClick={() => {
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
                                    (param) =>
                                        param !== undefined && param !== ""
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
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
