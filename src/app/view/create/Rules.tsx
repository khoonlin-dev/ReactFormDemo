import {
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
    UseFormUnregister,
} from "react-hook-form";
import {
    LocalizedOperator,
    OperatorEnum,
    RevenueGroup,
    RevenueRule,
} from "../../../state/state";
import addImg from "../../../assets/add.svg";
import ParameterView from "./Parameter";
import { ReactHookUtils } from "../../../utils/ReactHookUtils";
import { useRef } from "react";

import "../../style/create/Rules.scss";

type RulesViewProps = {
    index: number;
    fieldList: string[];
    operatorList: OperatorEnum[];
    onRemoveRule: () => void;
    disabled: boolean;
};

type FormProps = {
    register: UseFormRegister<RevenueGroup>;
    unregister: UseFormUnregister<RevenueGroup>;
    getValues: UseFormGetValues<RevenueGroup>;
    setValue: UseFormSetValue<RevenueGroup>;
};

type RulesBodyProps = FormProps & {
    fieldList: string[];
    operatorList: OperatorEnum[];
    disabled: boolean;
};

type RulesContainerViewProps = RulesViewProps & FormProps;

type RulesRevenueViewProps = {
    disabled: boolean;
    index: number;
    register: UseFormRegister<RevenueGroup>;
    setValue: UseFormSetValue<RevenueGroup>;
};

function AddRulesButton({
    disabled,
    onClick,
}: {
    disabled: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className="add-rule-button"
            type="button"
            disabled={disabled}
            onClick={onClick}
        >
            <img src={addImg} height={18} width={18}></img>
            <div style={{ height: "fit-content", alignSelf: "center" }}>
                Add
            </div>
        </button>
    );
}

/**
 * This view bases on form data as state in order to
 * avoid unnecessary re-rendering and serve as single source-of-truth
 */
export default function RulesBody(props: RulesBodyProps) {
    const { getValues, setValue, disabled } = props;
    const forceUpdate = ReactHookUtils.useForceUpdate();
    const ref = useRef<Partial<RevenueRule>[]>([]);

    ref.current = getValues(`rules`) || [];

    return (
        <>
            <div className="rules-header">
                <div style={{ alignSelf: "center" }}>Rules</div>
                <AddRulesButton
                    disabled={disabled}
                    onClick={function () {
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
                />
            </div>
            <div className="rules-body">
                {ref.current.map((rule, i) => {
                    return (
                        <RulesContainerView
                            key={`rules-container-${i}`}
                            index={i}
                            {...props}
                            onRemoveRule={() => {
                                ref.current = getValues(`rules`);
                                ref.current.splice(i, 1);
                                setValue(`rules`, ref.current as RevenueRule[]);
                                forceUpdate();
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}

function RulesRevenueView({
    disabled,
    index,
    register,
    setValue,
}: RulesRevenueViewProps) {
    return (
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
                // Stupid typescript doesn't let me keep rules.${index}.field in a var by triggering type error here...
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
    );
}

/**
 * This view bases on form data as state in order to
 * avoid unnecessary re-rendering and serve as single source-of-truth
 */
function RulesContainerView({
    index,
    onRemoveRule,
    fieldList,
    operatorList,
    disabled,
    register,
    unregister,
    getValues,
    setValue,
}: RulesContainerViewProps) {
    return (
        <div className="rules-outer-container">
            <div className="rules-inner-container-header">
                <div>{`Rule ${index + 1}`}</div>{" "}
                <button
                    type="button"
                    disabled={disabled}
                    className="remove-rules-button"
                    onClick={() => {
                        onRemoveRule();
                    }}
                >
                    X
                </button>
            </div>
            <div className="rules-inner-container">
                <div style={{ paddingTop: "2px" }}>If</div>
                <select
                    className="field-select"
                    disabled={disabled}
                    placeholder="Select field"
                    id={`rules.${index}.field`}
                    {
                        // Stupid typescript doesn't let me keep rules.${index}.field in a var by triggering type error here...
                        ...register(`rules.${index}.field`, { required: true })
                    }
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
                    className="operator-select"
                    disabled={disabled}
                    placeholder="Select operator"
                    id={`rules.${index}.operator`}
                    {...register(`rules.${index}.operator`, { required: true })}
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
            <RulesRevenueView
                index={index}
                disabled={disabled}
                setValue={setValue}
                register={register}
            />
        </div>
    );
}
