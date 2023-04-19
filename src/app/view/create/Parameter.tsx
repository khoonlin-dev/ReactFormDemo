import {
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form";
import { RevenueGroup } from "../../../state/state";
import { useCallback, useRef } from "react";
import { useForceUpdate } from "../../../utils/ReactHookUtils";

import addCircleImg from "../../../assets/add_circle_outline.svg";
import removeCircleImg from "../../../assets/remove_circle_outline.svg";
import "../../style/create/Parameter.scss";

type ParameterViewProps = {
    disabled?: boolean;
    rulesId: number;
    register: UseFormRegister<RevenueGroup>;
    getValues: UseFormGetValues<RevenueGroup>;
    setValue: UseFormSetValue<RevenueGroup>;
};

type ParameterOperationProps = {
    interactable: boolean;
    rulesId: number;
    ref: React.MutableRefObject<string[]>;
};

type ParameterDeleteOperationProps = ParameterOperationProps & {
    currentId: number;
};

/**
 * This view bases on form data as state in order to
 * avoid unnecessary re-rendering and serve as single source-of-truth
 */
export default function ParameterView({
    disabled,
    rulesId,
    getValues,
    setValue,
    register,
}: ParameterViewProps) {
    const ref = useRef<string[]>([]);
    // Re-apply this every re-render
    ref.current = getValues(`rules.${rulesId}.parameter`) || [];
    const forceUpdate = useForceUpdate();
    const maxReached = ref.current.length >= 3;

    const onAdd = useCallback(
        function ({ interactable, rulesId, ref }: ParameterOperationProps) {
            return function () {
                if (interactable) {
                    ref.current = getValues(`rules.${rulesId}.parameter`) || [];
                    ref.current.push("");
                    forceUpdate();
                }
            };
        },
        [forceUpdate, getValues]
    );

    const onDelete = useCallback(
        function ({
            interactable,
            rulesId,
            currentId,
            ref,
        }: ParameterDeleteOperationProps) {
            return function () {
                if (interactable) {
                    ref.current = getValues(`rules.${rulesId}.parameter`);
                    ref.current.splice(currentId, 1);
                    setValue(`rules.${rulesId}.parameter`, ref.current);
                    forceUpdate();
                }
            };
        },
        [forceUpdate, getValues, setValue]
    );

    return (
        <div className="parameter-holder">
            {ref.current.map((param, i) => {
                // First param cannot be removed
                // Add button on first param needs to hide if there's already 3 params
                const isFirst = i === 0;
                return (
                    <div
                        className="parameter-list"
                        key={`parameter-list-${i}-${ref.current[i]}`}
                    >
                        <input
                            className="parameter-input"
                            disabled={disabled}
                            type="text"
                            defaultValue={param}
                            placeholder="Enter parameter"
                            {...register(`rules.${rulesId}.parameter.${i}`, {
                                onBlur: (
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    ref.current[i] = e.target.value;
                                },
                            })}
                        ></input>
                        {isFirst ? (
                            <img
                                className="button-img"
                                id="create-parameter"
                                src={addCircleImg}
                                style={{ opacity: maxReached ? 0 : 1 }}
                                onClick={onAdd({
                                    interactable: !disabled && !maxReached,
                                    ref,
                                    rulesId,
                                })}
                            ></img>
                        ) : (
                            <img
                                className="button-img"
                                id={`remove-parameter-${i}`}
                                src={removeCircleImg}
                                onClick={onDelete({
                                    interactable: !disabled,
                                    ref,
                                    rulesId,
                                    currentId: i,
                                })}
                            ></img>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
