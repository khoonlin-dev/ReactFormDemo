import {
    Path,
    UseFormGetValues,
    UseFormRegister,
    UseFormUnregister,
} from "react-hook-form";
import { RevenueGroup } from "../../../state/state";
import { useEffect, useRef, useState } from "react";
import "../../style/create/TextAreaWithCounter.scss";

type TextAreaWithCounterProps = {
    label: Path<RevenueGroup>;
    register: UseFormRegister<RevenueGroup>;
    required: boolean;
    unregister: UseFormUnregister<RevenueGroup>;
    getValues: UseFormGetValues<RevenueGroup>;

    textAreaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    changeColorWhenFull: boolean;
};
// The following component is an example of your existing Input Component
export default function TextAreaWithCounter({
    label: id,
    register,
    required,
    textAreaProps,
    getValues,
}: TextAreaWithCounterProps) {
    const [length, setLength] = useState(
        (textAreaProps.value || textAreaProps.defaultValue)?.toString()
            ?.length || 0
    );
    /**
     * This part is trouble. React hook form's reset doesn't trigger onchange or oninput,
     * just the re-render and it changes only whatever's inside the text box without triggering any event.
     *
     * Hence without any event to rely on, we have to keep track of any
     * non-self-updated render and check for the actual form value for best accuracy
     */
    const selfRerendered = useRef(false);
    const actualFormLength = (getValues(id) as string)?.length || 0;
    const shouldUseActualFormLength = !selfRerendered.current;
    // Set it back because it's a ref
    selfRerendered.current = false;

    const customRef = useRef<HTMLTextAreaElement>();
    const { ref, ...rest } = register(id, { required });

    // ComponentDidMount
    useEffect(() => {
        const current = customRef.current;
        if (current) {
            current.oninput = () => {
                selfRerendered.current = true;
                setLength(current.value?.length || 0);
            };
        }
    }, []);

    return (
        <div className="text-area-counter-container">
            <label className="form-label" htmlFor={textAreaProps.id}>
                {"Group Description"}
            </label>
            <div className="text-area-counter-input">
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
                    <div className="text-area-counter-label">{`${
                        shouldUseActualFormLength ? actualFormLength : length
                    }/${textAreaProps.maxLength}`}</div>
                ) : undefined}
            </div>
        </div>
    );
}
