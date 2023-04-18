import { useRef, useState } from "react";
import { LocalizedOperator, RevenueRule } from "../../../state/state";
import deleteGroup from "../../../assets/Iconsdelete.svg";
import sortImg from "../../../assets/sort.svg";
import "../../style/browse/RuleList.scss";

enum Sort {
    Id = 0,
    Field,
    Operator,
    Parameter1,
    Parameter2,
    Parameter3,
    Revenue,
}

enum SortOrder {
    Ascending = 0,
    Descending,
}

function sortRules({
    rule,
    sortField,
    sortOrder,
}: { rule: (RevenueRule & { id: number })[] } & {
    sortField: Sort;
    sortOrder: SortOrder;
}): (RevenueRule & { id: number })[] {
    return rule.slice().sort((a, b) => {
        switch (sortField) {
            case Sort.Id: {
                return sortOrder ? b.id - a.id : a.id - b.id;
            }
            case Sort.Field: {
                if (sortOrder)
                    return a.field < b.field ? 1 : a.field === b.field ? 0 : -1;
                return a.field > b.field ? 1 : a.field === b.field ? 0 : -1;
            }
            case Sort.Revenue: {
                return sortOrder
                    ? b.revenue - a.revenue
                    : a.revenue - b.revenue;
            }
            case Sort.Operator: {
                return sortOrder
                    ? b.operator - a.operator
                    : a.operator - b.operator;
            }
            case Sort.Parameter1: {
                const right = a.parameter[0] || "";
                const left = b.parameter[0] || "";
                if (sortOrder)
                    return right < left ? 1 : right === left ? 0 : -1;
                return right > left ? 1 : right === left ? 0 : -1;
            }
            case Sort.Parameter2: {
                const right = a.parameter[1] || "";
                const left = b.parameter[1] || "";
                if (sortOrder)
                    return right < left ? 1 : right === left ? 0 : -1;
                return right > left ? 1 : right === left ? 0 : -1;
            }
            case Sort.Parameter3: {
                const right = a.parameter[2] || "";
                const left = b.parameter[2] || "";
                if (sortOrder)
                    return right < left ? 1 : right === left ? 0 : -1;
                return right > left ? 1 : right === left ? 0 : -1;
            }
            default:
                return 0;
        }
    });
}

function SortImageButton({
    onClick,
    disabled,
}: {
    onClick?: () => void;
    disabled: boolean;
}) {
    return (
        <img
            src={sortImg}
            className="button-img"
            height="16px"
            width="16px"
            onClick={function () {
                !disabled && onClick && onClick();
            }}
        ></img>
    );
}

const generateOnSort = function (
    field: Sort,
    current: Record<Sort, SortOrder | undefined>,
    dispatch: React.Dispatch<
        React.SetStateAction<{
            sortField: Sort;
            sortOrder: SortOrder;
        }>
    >
) {
    return function () {
        const currentOrder = current[field];
        const newOrder =
            currentOrder === undefined ? SortOrder.Ascending : 1 - currentOrder;
        current[field] = newOrder;
        dispatch({
            sortField: field,
            sortOrder: newOrder,
        });
    };
};

export default function RuleListView({
    rule,
    onRemoveRule,
    disabled,
}: {
    rule: RevenueRule[];
    onRemoveRule: (id: number) => () => void;
    disabled: boolean;
}) {
    const [sort, setSort] = useState({
        sortField: Sort.Id,
        sortOrder: SortOrder.Ascending,
    });
    const currentSort = useRef({
        [Sort.Id]: SortOrder.Ascending,
    } as Record<Sort, SortOrder | undefined>);
    const sortedRules = sortRules({
        rule: rule.map((ruleItem, i) => {
            return { ...ruleItem, id: i };
        }),
        ...sort,
    });

    const rulesLength = sortedRules.length;

    return (
        <>
            <div className={"rule-list-title"} key={`rule-title`}>
                <div className={"rule-id"}>
                    <div>{"Rule"}</div>
                    <SortImageButton
                        disabled={disabled}
                        onClick={generateOnSort(
                            Sort.Id,
                            currentSort.current,
                            setSort
                        )}
                    />
                </div>
                <div className={"rule-field"}>
                    <div>{"Field"}</div>
                    <SortImageButton
                        disabled={disabled}
                        onClick={generateOnSort(
                            Sort.Field,
                            currentSort.current,
                            setSort
                        )}
                    />
                </div>
                <div className={"rule-operator"}>
                    <div>{"Operator"}</div>
                    <SortImageButton
                        disabled={disabled}
                        onClick={generateOnSort(
                            Sort.Operator,
                            currentSort.current,
                            setSort
                        )}
                    />
                </div>
                <div className={"rule-parameter-1"}>
                    <div>{"Parameter 1"}</div>
                    <SortImageButton
                        disabled={disabled}
                        onClick={generateOnSort(
                            Sort.Parameter1,
                            currentSort.current,
                            setSort
                        )}
                    />
                </div>
                <div className={"rule-parameter-2"}>
                    <div>{"Parameter 2"}</div>
                    <SortImageButton
                        disabled={disabled}
                        onClick={generateOnSort(
                            Sort.Parameter2,
                            currentSort.current,
                            setSort
                        )}
                    />
                </div>
                <div className={"rule-parameter-3"}>
                    <div>{"Parameter 3"}</div>
                    <SortImageButton
                        disabled={disabled}
                        onClick={generateOnSort(
                            Sort.Parameter3,
                            currentSort.current,
                            setSort
                        )}
                    />
                </div>
                <div className={"revenue"}>
                    <div>{"Revenue"}</div>
                    <SortImageButton
                        disabled={disabled}
                        onClick={generateOnSort(
                            Sort.Revenue,
                            currentSort.current,
                            setSort
                        )}
                    />
                </div>
                <div className={"action"}>{"Action"}</div>
            </div>
            <div className="rule-list">
                {sortedRules.map(
                    ({ id, field, operator, parameter, revenue }) => {
                        return (
                            <div
                                className="rule-list-item"
                                key={`${field}:${operator}:${parameter.join(
                                    ":"
                                )}`}
                            >
                                <div className={"rule-id"}>{id + 1}</div>
                                <div className={"rule-field"}>{field}</div>
                                <div className={"rule-operator"}>
                                    {LocalizedOperator[operator]}
                                </div>
                                <div className={"rule-parameter-1"}>
                                    {parameter[0]}
                                </div>
                                <div className={"rule-parameter-2"}>
                                    {parameter[1] || ""}
                                </div>
                                <div className={"rule-parameter-3"}>
                                    {parameter[2] || ""}
                                </div>
                                <div className={"revenue"}>{`${revenue}%`}</div>
                                {rulesLength <= 1 ? undefined : (
                                    <img
                                        className="button-img"
                                        src={deleteGroup}
                                        height="18px"
                                        width="18px"
                                        style={{ justifySelf: "center" }}
                                        onClick={function () {
                                            !disabled && onRemoveRule(id)();
                                        }}
                                    />
                                )}
                            </div>
                        );
                    }
                )}
            </div>
        </>
    );
}
