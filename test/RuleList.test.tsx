import { useRef, RefObject } from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import jquery from "jquery";
import ParameterView from "../src/app/view/create/Parameter";
import CreateFooter from "../src/app/view/create/Footer";
import { RevenueGroup, OperatorEnum, RevenueRule } from "../src/state/state";

// This library fixes warning "The current testing environment is not configured to support act(...) with vitest and React 18"
import "@testing-library/react";

import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";

async function delay(ms: number) {
    return new Promise((done) => {
        setTimeout(done, ms);
    });
}

function TestForm({
    onSubmit,
    onReset,
    render,
    formRef,
    customValidation,
}: {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    onReset?: React.FormEventHandler<HTMLFormElement>;
    customValidation?: () => void;
    formRef: React.LegacyRef<HTMLFormElement>;
    render: () => JSX.Element;
}) {
    return (
        <form
            className="test-form"
            onSubmit={onSubmit}
            onReset={onReset}
            ref={formRef as RefObject<HTMLFormElement>}
        >
            {render()}
            {<CreateFooter onSubmit={customValidation} />}
        </form>
    );
}

function TestParameter({
    onSubmit,
    onInvalid,
    resetData,
    disabled,
    initialValue,
}: {
    onSubmit: SubmitHandler<RevenueGroup>;
    onInvalid?: SubmitErrorHandler<RevenueGroup>;
    resetData?: RevenueGroup;
    disabled?: boolean;
    initialValue?: Partial<RevenueGroup> & { rules?: Partial<RevenueRule>[] };
}) {
    const { register, handleSubmit, getValues, setValue, reset } =
        useForm<RevenueGroup>({
            mode: "onSubmit",
            defaultValues: initialValue || { rules: [{ parameter: [""] }] },
        });
    const rulesId = 0;
    const formRef = useRef<HTMLFormElement>();
    return (
        <TestForm
            formRef={formRef as React.LegacyRef<HTMLFormElement>}
            render={() => {
                return (
                    <ParameterView
                        disabled={disabled}
                        rulesId={rulesId}
                        getValues={getValues}
                        setValue={setValue}
                        register={register}
                    />
                );
            }}
            onSubmit={
                handleSubmit(
                    onSubmit,
                    onInvalid
                ) as React.FormEventHandler<HTMLFormElement>
            }
            onReset={() => {
                reset(
                    resetData || {
                        name: "",
                        desc: "",
                        special: false,
                        rules: [],
                    }
                );
            }}
        />
    );
}

// TODO: Add in the test details for reset form and update parameter

describe("current state test", () => {
    let container: HTMLDivElement;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });
    afterEach(() => {
        container && document.body.removeChild(container);
        // @ts-expect-error test lifecycle
        container = null;
    });
    it("Should add one new parameter when clicked on add button", () =>
        new Promise((done, reject) => {
            act(() => {
                ReactDOM.createRoot(container).render(
                    <TestParameter
                        onSubmit={() => {
                            //Do nothing
                        }}
                    />
                );
            });

            delay(1000)
                .then(() => {
                    const addParamButton = jquery("#create-parameter");
                    if (addParamButton) {
                        addParamButton.trigger("click");
                        return delay(1000);
                    } else {
                        reject("Cannot find create parameter button");
                    }
                })
                .then(() => {
                    const paramContainer =
                        container.querySelector(".parameter-holder");
                    // Initiated with one child, now we add another child
                    if (paramContainer?.children.length === 2) {
                        done(undefined);
                    } else {
                        reject(
                            `Param container has ${
                                paramContainer?.children.length || 0
                            } child`
                        );
                    }
                })
                .catch((e: Error) => {
                    reject(e.message);
                });
        }));

    it("Should not add parameters when there are already three parameters", () =>
        new Promise((done, reject) => {
            act(() => {
                ReactDOM.createRoot(container).render(
                    <TestParameter
                        onSubmit={() => {
                            //Do nothing
                        }}
                        initialValue={{
                            rules: [
                                {
                                    revenue: 0,
                                    field: "test-field",
                                    operator: OperatorEnum.CONTAINS,
                                    parameter: ["", "", ""],
                                },
                            ],
                        }}
                    />
                );
            });

            const initChild = container.querySelector(".parameter-holder");
            if (!initChild) {
                reject("Cannot find parameter holder initially");
            } else {
                delay(1000)
                    .then(() => {
                        const addParamButton = jquery("#create-parameter");
                        addParamButton.trigger("click");
                        const currentChild =
                            container.querySelector(".parameter-holder");
                        if (!currentChild) {
                            reject("Cannot find parameter holder initially");
                        } else {
                            // Child count should be the same
                            if (
                                currentChild.children.length ===
                                initChild.children.length
                            ) {
                                done(undefined);
                            } else {
                                reject(
                                    `Child count was ${initChild.children.length}, now is ${currentChild.children.length}`
                                );
                            }
                        }
                    })
                    .catch((e: Error) => {
                        reject(e.message);
                    });
            }
        }));
});
