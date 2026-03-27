import {Grid2, styled} from "@mui/material";
import StaticMapPage from "../map/StaticMapPage";
import React from "react";
import { FullHeightGrid } from "../components/FullHeightGrid";
import { useParams } from "react-router-dom";
import { useValetudoEventQuery } from "../api";

type EventMapParams = {
    eventId: string
}

const EventMap = (props: Record<string, never> ): React.ReactElement => {
    const { eventId } = useParams<EventMapParams>();
    useValetudoEventQuery(eventId as string);
    const {
        data: eventData,
        isFetching: _eventDataFetching,
        isPending: eventDataPending,
        error: eventDataError,
    } = useValetudoEventQuery(eventId as string);

    return (
        <FullHeightGrid container direction="row" justifyContent="space-evenly">
            <Grid2 size="grow">
                <StaticMapPage
                    mapData={eventData?.mapState}
                    mapIsPending={eventDataPending}
                    mapLoadError={eventDataError}
                />
            </Grid2>
        </FullHeightGrid>
    );
};

export default EventMap;
