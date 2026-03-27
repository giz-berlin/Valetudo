import {Box, CircularProgress, styled, Typography, useTheme} from "@mui/material";
import StaticMap from "./StaticMap";
import React from "react";
import { RawMapData } from "../api";


const Container = styled(Box)({
    flex: "1",
    height: "100%",
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
});

type StaticMapPageProps = {
    mapData: RawMapData | undefined
    mapLoadError: Error | null
    mapIsPending: boolean
}

const StaticMapPage = (props: StaticMapPageProps ): React.ReactElement => {
    const theme = useTheme();

    if (props.mapLoadError) {
        return (
            <Container>
                <Typography color="error">Error loading map data</Typography>
                <Box m={1}/>
            </Container>
        );
    }

    if (
        (!props.mapData && props.mapIsPending)
    ) {
        return (
            <Container>
                <CircularProgress/>
            </Container>
        );
    }

    if (!props.mapData) {
        return (
            <Container>
                <Typography align="center">No map data for this event. Sorry.</Typography>
            </Container>
        );
    }

    return <StaticMap
        rawMap={props.mapData}
        paletteMode={theme.palette.mode}
    />;
};

export default StaticMapPage;
