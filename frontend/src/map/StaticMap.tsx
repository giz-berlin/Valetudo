import BaseMap, {MapContainer, MapProps, MapState, usePendingMapAction} from "./BaseMap";
import {Capability} from "../api";
import GoToTargetClientStructure from "./structures/client_structures/GoToTargetClientStructure";
import {ActionsContainer} from "./Styled";
import SegmentActions from "./actions/live_map_actions/SegmentActions";
import SegmentLabelMapStructure from "./structures/map_structures/SegmentLabelMapStructure";
import ZoneActions from "./actions/live_map_actions/ZoneActions";
import ZoneClientStructure from "./structures/client_structures/ZoneClientStructure";
import GoToActions from "./actions/live_map_actions/GoToActions";
import {TapTouchHandlerEvent} from "./utils/touch_handling/events/TapTouchHandlerEvent";
import React from "react";
import {LiveMapModeSwitcher} from "./LiveMapModeSwitcher";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";


export type LiveMapMode = "segments" | "zones" | "goto" | "none";
const LIVE_MAP_MODE_LOCAL_STORAGE_KEY = "live-map-mode";

interface StaticMapProps extends MapProps {
}

interface SataticMapState extends MapState {
}

class LiveMap extends BaseMap<StaticMapProps, SataticMapState> {
    constructor(props: StaticMapProps) {
        super(props);
    }

    render(): React.ReactElement {
        return (
            <MapContainer style={{overflow: "hidden"}}>
                <canvas
                    ref={this.canvasRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        imageRendering: "crisp-edges"
                    }}
                />
            </MapContainer>
        );
    }
}

export default LiveMap;
