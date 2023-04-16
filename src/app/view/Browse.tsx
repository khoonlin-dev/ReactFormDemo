import React from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
    removeGroup,
    removeRule,
    selectRevenueGroups,
} from "../../state/revenueSlice";
import {
    LocalizedOperator,
    OperatorEnum,
    RevenueGroup,
    RevenueRule,
} from "../../state/state";

import "./Browse.css";
import deleteGroup from "../../assets/Iconsdelete.svg";
import sortImg from "../../assets/sort.svg";

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

type GroupViewProps = {
    onRemoveGroup: () => void;
    onRemoveRule: (id: number) => () => void;
} & RevenueGroup;

// TODO Fix text area with count's count didnt update after reset / submit

function sortRules({
    rule,
    sortField,
    sortOrder,
}: { rule: (RevenueRule & { id: number })[] } & {
    sortField: Sort;
    sortOrder: SortOrder;
}): (RevenueRule & { id: number })[] {
    return rule.slice();
}

function SortImageButton({ onClick }: { onClick?: () => void }) {
    return (
        <img
            src={sortImg}
            className="button-img"
            height="16px"
            width="16px"
            onClick={onClick}
        ></img>
    );
}

function RuleListView({
    rule,
    onRemoveRule,
}: {
    rule: RevenueRule[];
    onRemoveRule: (id: number) => () => void;
}) {
    const [sort, setSort] = React.useState({
        sortField: Sort.Id,
        sortOrder: SortOrder.Ascending,
    });
    const sortedRules = sortRules({
        rule: rule.map((ruleItem, i) => {
            return { ...ruleItem, id: i };
        }),
        ...sort,
    });

    // for (let i = 0; i <= rule.length; i++) {
    //     if (i > endIndex || rateList.length === 0) {
    //         list.push(
    //             <div
    //                 className={"currency-list-item"}
    //                 key={`empty-filler-${i}`}
    //             ></div>
    //         );
    //     } else {
    //         const { name, type, unit, value } = rateList[i];
    //         list.push(
    //             <div className={"currency-list-item"} key={`currency-${name}`}>
    //                 <div className={"currency-name"}>{name}</div>
    //                 <div className={"currency-type"}>{type}</div>
    //                 <div className={"currency-id"}>{unit}</div>
    //                 <div className={"currency-value"}>{value.toFixed(3)}</div>
    //             </div>
    //         );
    //     }
    // }

    return (
        <>
            <div className={"rule-list-title"} key={`rule-title`}>
                <div className={"rule-id"}>
                    <div>{"Rule"}</div>
                    <SortImageButton />
                </div>
                <div className={"rule-field"}>
                    <div>{"Field"}</div>
                    <SortImageButton />
                </div>
                <div className={"rule-operator"}>
                    <div>{"Operator"}</div>
                    <SortImageButton />
                </div>
                <div className={"rule-parameter-1"}>
                    <div>{"Parameter 1"}</div>
                    <SortImageButton />
                </div>
                <div className={"rule-parameter-2"}>
                    <div>{"Parameter 2"}</div>
                    <SortImageButton />
                </div>
                <div className={"rule-parameter-3"}>
                    <div>{"Parameter 3"}</div>
                    <SortImageButton />
                </div>
                <div className={"revenue"}>
                    <div>{"Revenue"}</div>
                    <SortImageButton />
                </div>
                <div className={"action"}>{"Action"}</div>
            </div>
            <div className="rule-list">
                {sortedRules.map(
                    ({ id, field, operator, parameter, revenue }) => {
                        return (
                            <div
                                className="rule-list-item"
                                key={`${field}-${operator}`}
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
                                <img
                                    className="button-img"
                                    src={deleteGroup}
                                    height="18px"
                                    width="18px"
                                    style={{ justifySelf: "center" }}
                                    onClick={() => {
                                        onRemoveRule(id)();
                                    }}
                                ></img>
                            </div>
                        );
                    }
                )}
            </div>
        </>
    );
}

function GroupView({
    onRemoveGroup,
    onRemoveRule,
    name,
    desc,
    special,
    rules,
}: GroupViewProps) {
    return (
        <div className="group-view-container">
            <div
                style={{
                    display: "inline-flex",
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ width: "90%" }}>
                    <div className="group-view-header">
                        <div className="group-view-name">{name}</div>
                        {special ? (
                            <div className="group-view-special">
                                Special Group
                            </div>
                        ) : undefined}
                    </div>
                    <div className="group-view-desc">{desc}</div>
                </div>
                <img
                    src={deleteGroup}
                    alt="Delete group"
                    className="button-img"
                    style={{ alignSelf: "flex-start" }}
                    onClick={() => {
                        onRemoveGroup();
                    }}
                />
            </div>
            <div className="rulesList">
                <RuleListView rule={rules} onRemoveRule={onRemoveRule} />
            </div>
        </div>
    );
}

export default function BrowseView() {
    const groups = useAppSelector(selectRevenueGroups);
    const dispatch = useAppDispatch();
    // const disabled = status === "uploading";

    return (
        <div className="browse-view">
            <h1>Browse Revenue Group</h1>
            {groups.map((group, i) => {
                return (
                    <GroupView
                        key={`group-${i}-${group.name}`}
                        {...group}
                        onRemoveGroup={function () {
                            dispatch(removeGroup(group.name));
                        }}
                        onRemoveRule={function (ruleIndex: number) {
                            return function () {
                                dispatch(
                                    removeRule({ group: group.name, ruleIndex })
                                );
                            };
                        }}
                    />
                );
            })}
        </div>
    );
}
