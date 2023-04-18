import React, { useEffect, useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
    fetchGroup,
    getInfo,
    selectRevenueGroups,
    selectRevenueStatus,
} from "../state/revenueSlice";
import CreateView from "./view/Create";
import { APIInfo, OperatorEnum } from "../state/state";
import BrowseView from "./view/Browse";

function App() {
    //const group = useAppSelector(selectRevenueGroups);
    const status = useAppSelector(selectRevenueStatus);
    const dispatch = useAppDispatch();
    const [info, setInfo] = useState<APIInfo>({
        maxDescLength: 0,
        operatorList: [],
        fieldList: [],
    });

    useEffect(() => {
        dispatch(fetchGroup())
            .then((res) => {
                const { error } = res as { error?: Error };
                if (error) {
                    throw error;
                } else {
                    return dispatch(getInfo())
                        .then((res) => {
                            const { error, payload } = res as {
                                error?: Error;
                                payload: APIInfo;
                            };
                            if (error) {
                                throw error;
                            }
                            setInfo(payload);
                        })
                        .catch((e) => {
                            alert(e);
                        });
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
                    <CreateView {...info} />
                    <BrowseView />
                </div>
            )}
        </div>
    );
}

export default App;
