import React, { useEffect, useState } from "react";
import "./style/App.scss";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import revenueReducer, {
    fetchGroup,
    getInfo,
    selectRevenueStatus,
    setName,
} from "../state/revenueSlice";
import CreateView from "./view/create/Create";
import { APIInfo } from "../state/state";
import BrowseView from "./view/browse/Browse";

function App() {
    console.log(revenueReducer);
    console.log(setName);
    const status = useAppSelector(selectRevenueStatus);
    const dispatch = useAppDispatch();
    const [info, setInfo] = useState<APIInfo>({
        maxDescLength: 0,
        operatorList: [],
        fieldList: [],
    });

    useEffect(
        () => {
            dispatch(fetchGroup())
                .then((res) => {
                    const { error } = res as { error?: Error };
                    if (error && !navigator.serviceWorker.controller) {
                        error.message = "Service Worker";
                    }
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
                        .catch((error) => {
                            throw error;
                        })
                        .finally(() => {
                            if (error) {
                                throw error;
                            }
                        });
                })
                .catch((error: Error) => {
                    if (error.message === "Service Worker") {
                        if (
                            confirm(
                                "Service worker is installed but not claimed yet.\nAs SW is used as mocked server in this demo, please reload for best experience.\nBy clicking cancel you agree to operate without persistent data"
                            )
                        ) {
                            location.reload();
                        } else {
                            alert(
                                "So you wanna try and see how this page works without service worker huh..."
                            );
                        }
                    } else {
                        alert("An error occurred.");
                        location.reload();
                    }
                });
        },
        // Empty dependency means componentDidMount
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div className="App">
            {status.endsWith(":waiting") ? (
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
