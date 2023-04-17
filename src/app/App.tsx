import React, { useEffect, useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
    fetchGroup,
    selectRevenueGroups,
    selectRevenueStatus,
} from "../state/revenueSlice";
import CreateView from "./view/Create";
import { OperatorEnum } from "../state/state";
import BrowseView from "./view/Browse";

const dummyData = {
    maxDescLength: 250,
    fieldList: ["abc", "def", "ghi"],
    operatorList: [OperatorEnum.CONTAINS, OperatorEnum.IS],
};

function App() {
    //const group = useAppSelector(selectRevenueGroups);
    const status = useAppSelector(selectRevenueStatus);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch(fetchGroup())
            .then((res) => {
                const { error } = res as { error?: Error };
                if (error) {
                    throw error;
                }
            })
            .catch((e) => {
                if (!navigator.serviceWorker.controller) {
                    if (
                        confirm(
                            "Service worker is installed but not claimed yet. Please reload the page for best experience.\nBy clicking cancel you agree to operate without persistent data"
                        )
                    ) {
                        location.reload();
                    } else {
                        alert(
                            "So you wanna try and see how this page works without service worker huh..."
                        );
                    }
                }
            });
    }, []);

    return (
        <div className="App">
            {status === "get:waiting" ? (
                <div>Loading</div>
            ) : (
                <div className="app-container">
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
