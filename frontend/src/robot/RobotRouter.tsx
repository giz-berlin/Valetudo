import {Route} from "react-router";
import {Navigate, Routes} from "react-router-dom";
import Consumables from "./Consumables";
import ManualControl from "./ManualControl";
import TotalStatistics from "./TotalStatistics";
import React from "react";
import EventMap from "./EventMap";

const RobotRouter = (): React.ReactElement => {
    return (
        <Routes>
            <Route path={"consumables"} element={<Consumables/>}/>
            <Route path={"manual_control"} element={<ManualControl/>}/>
            <Route path={"total_statistics"} element={<TotalStatistics/>}/>
            <Route path={"event_map/:eventId"} element={<EventMap/>}/>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default RobotRouter;
