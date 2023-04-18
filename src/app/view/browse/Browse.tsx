import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
    removeGroup,
    removeRule,
    selectRevenueGroups,
    selectRevenueStatus,
} from "../../../state/revenueSlice";
import GroupView from "./Group";
import "../../style/browse/Browse.scss";

// TODO Fix text area with count's count didnt update after reset / submit

export default function BrowseView() {
    const groups = useAppSelector(selectRevenueGroups);
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectRevenueStatus);
    const disabled = status.endsWith(":waiting");

    return (
        <div className="browse-view">
            <div className="view-title">Browse Revenue Group</div>
            {groups.length === 0 ? (
                <div>Nothing to show here</div>
            ) : (
                groups.map((group, i) => {
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
                                        .catch((e: Error) => {
                                            alert("Error! " + e.message);
                                        });
                                };
                            }}
                            disabled={disabled}
                        />
                    );
                })
            )}
        </div>
    );
}
