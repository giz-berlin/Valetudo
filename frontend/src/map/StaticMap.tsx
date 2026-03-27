import BaseMap, {MapContainer, MapProps, MapState} from "./BaseMap";
import React from "react";

interface StaticMapProps extends MapProps {
}

interface SataticMapState extends MapState {
}

class StaticMap extends BaseMap<StaticMapProps, SataticMapState> {
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

export default StaticMap;
