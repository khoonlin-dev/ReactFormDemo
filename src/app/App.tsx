import React, { useEffect, useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
    fetchGroup,
    selectRevenueGroups,
    selectRevenueStatus,
} from "../state/revenueSlice";
import CreateView from "./view/Create";
import { OperatorEnum } from "../state/state";
import "react-custom-scroll/dist/customScroll.css";
import BrowseView from "./view/Browse";

const dummyData = {
    maxDescLength: 250,
    fieldList: ["abc", "def", "ghi"],
    operatorList: [OperatorEnum.CONTAINS, OperatorEnum.IS],
};

function App() {
    const group = useAppSelector(selectRevenueGroups);
    const status = useAppSelector(selectRevenueStatus);

    return (
        <div className="App">
            {status === "loading" ? (
                <div>Loading</div>
            ) : (
                <div style={{ display: "inline-flex", columnGap: "7%" }}>
                    <CreateView
                        operatorList={dummyData.operatorList}
                        fieldList={dummyData.fieldList}
                        maxDescLength={dummyData.maxDescLength}
                    />
                    <BrowseView />
                </div>
            )}
        </div>
    );
}

export default App;
