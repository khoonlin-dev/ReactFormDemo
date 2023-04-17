import React from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
    removeGroup,
    removeRule,
    selectRevenueGroups,
    selectRevenueStatus,
} from "../../state/revenueSlice";
import {
    LocalizedOperator,
    RevenueGroup,
    RevenueRule,
} from "../../state/state";

import "./Browse.scss";
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
    disabled: boolean;
} & RevenueGroup;

// TODO Fix text area with count's count didnt update after reset / submit

// TODO Disallow remove rule if this is the last rule of the group already

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

function RuleListView({
    rule,
    onRemoveRule,
    disabled,
}: {
    rule: RevenueRule[];
    onRemoveRule: (id: number) => () => void;
    disabled: boolean;
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
    const rulesLength = sortedRules.length;

    return (
        <>
            <div className={"rule-list-title"} key={`rule-title`}>
                <div className={"rule-id"}>
                    <div>{"Rule"}</div>
                    <SortImageButton disabled={disabled} />
                </div>
                <div className={"rule-field"}>
                    <div>{"Field"}</div>
                    <SortImageButton disabled={disabled} />
                </div>
                <div className={"rule-operator"}>
                    <div>{"Operator"}</div>
                    <SortImageButton disabled={disabled} />
                </div>
                <div className={"rule-parameter-1"}>
                    <div>{"Parameter 1"}</div>
                    <SortImageButton disabled={disabled} />
                </div>
                <div className={"rule-parameter-2"}>
                    <div>{"Parameter 2"}</div>
                    <SortImageButton disabled={disabled} />
                </div>
                <div className={"rule-parameter-3"}>
                    <div>{"Parameter 3"}</div>
                    <SortImageButton disabled={disabled} />
                </div>
                <div className={"revenue"}>
                    <div>{"Revenue"}</div>
                    <SortImageButton disabled={disabled} />
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

function GroupView({
    onRemoveGroup,
    onRemoveRule,
    name,
    desc,
    special,
    rules,
    disabled,
}: GroupViewProps) {
    return (
        <div className="group-view-container">
            <div className="group-view-header">
                <div style={{ width: "90%" }}>
                    <div className="group-view-title">
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
                    onClick={
                        disabled
                            ? undefined
                            : () => {
                                  onRemoveGroup();
                              }
                    }
                />
            </div>
            <div className="rules-list">
                <RuleListView
                    rule={rules}
                    onRemoveRule={onRemoveRule}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}

export default function BrowseView() {
    const groups = useAppSelector(selectRevenueGroups);
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectRevenueStatus);
    const disabled = status.endsWith(":waiting");

    return (
        <div className="browse-view">
            <h1>Browse Revenue Group</h1>
            {groups.map((group, i) => {
                return (
                    <GroupView
                        key={`group-${i}-${group.name}`}
                        {...group}
                        onRemoveGroup={function () {
                            dispatch(removeGroup(i))
                                .then(() => {
                                    // Do nothing
                                })
                                .catch((e) => {
                                    alert("Error!");
                                });
                        }}
                        onRemoveRule={function (ruleIndex: number) {
                            return function () {
                                dispatch(
                                    removeRule({ groupIndex: i, ruleIndex })
                                )
                                    .then(() => {
                                        // Do nothing
                                    })
                                    .catch((e) => {
                                        alert("Error!");
                                    });
                            };
                        }}
                        disabled={disabled}
                    />
                );
            })}
        </div>
    );
}
