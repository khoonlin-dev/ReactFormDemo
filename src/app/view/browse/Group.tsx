import { RevenueGroup } from "../../../state/state";
import deleteGroup from "../../../assets/Iconsdelete.svg";
import RuleListView from "./RuleList";
import "../../style/browse/Group.scss";

type GroupViewProps = {
    onRemoveGroup: () => void;
    onRemoveRule: (id: number) => () => void;
    disabled?: boolean;
} & RevenueGroup;

export default function GroupView({
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
                <div className="group-view-header-left-section">
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
