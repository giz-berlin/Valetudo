const fs = require("fs");
const os = require("os");
const path = require("path");
const env = require("./res/env");

const EventEmitter = require("events").EventEmitter;

class ValetudoEventStore {
    /**
     *
     * @param {object} options
     */
    constructor(options) {
        /** @private */
        this.eventEmitter = new EventEmitter();

        this.persistentLocation = path.join(path.dirname(process.env[env.ConfigPath] ?? path.join(os.tmpdir(), "valetudo_config.json")), "valetudo_events");
        if (!fs.existsSync(this.persistentLocation)) {
            fs.mkdirSync(this.persistentLocation)
        }

        this.events = new Map();

        let stored_events = []
        for (const file_path of fs.readdirSync(this.persistentLocation)) {
            const absolute_file_path = path.join(this.persistentLocation, file_path);
            if (fs.statSync(absolute_file_path).isFile) {
                const event_object = JSON.parse(fs.readFileSync(absolute_file_path, {"encoding": "utf-8"}).toString());
                stored_events.push(event_object)
            }
        }
        // sort events from old to new in order to ensure correct deletion order below
        stored_events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        for (const event_object of stored_events) {
            this.events.set(event_object.id, event_object)
            this.eventEmitter.emit(EVENTS_UPDATED, event_object);
        }
    }

    /**
     *
     * @param {import("./valetudo_events/ValetudoEventHandlerFactory")} factory
     */
    setEventHandlerFactory(factory) {
        this.eventHandlerFactory = factory;
    }

    /**
     * @public
     *
     * @param {string} id
     * @returns {import("./valetudo_events/events/ValetudoEvent")}
     */
    getById(id) {
        // noinspection JSValidateTypes
        return this.events.get(id);
    }

    /**
     * @public
     * @returns {Array<import("./valetudo_events/events/ValetudoEvent")>}
     */
    getAll() {
        // noinspection JSValidateTypes
        return Array.from(this.events.values()).reverse();
    }

    persistEvent(event) {
        fs.writeFileSync(path.join(this.persistentLocation, event.id), JSON.stringify(event));
    }

    /**
     * @public
     * @param {import("./valetudo_events/events/ValetudoEvent")} event
     */
    raise(event) {
        if (!this.events.has(event.id)) {
            if (this.events.size >= LIMIT) {
                const event_id_to_delete = this.events.keys().next()?.value;
                this.events.delete(event_id_to_delete);
                // Events on disk get also deleted when processed
                if (fs.existsSync(path.join(this.persistentLocation, event_id_to_delete))) {
                    fs.rmSync(path.join(this.persistentLocation, event_id_to_delete));
                }
            }
        }

        this.persistEvent(event)

        this.events.set(event.id, event);
        this.eventEmitter.emit(EVENT_RAISED, event);
        this.eventEmitter.emit(EVENTS_UPDATED, event);
    }

    /**
     * Sometimes, events might stop being relevant due to external circumstances
     * In these situations, this can be called to set them processed without an interaction
     *
     * @public
     * @param {string} event_id
     * @return {void}
     */
    setProcessed(event_id) {
        const event = this.getById(event_id);

        if (!event) {
            throw new Error("No such Event");
        }

        if (event.processed === true) {
            return;
        }

        event.processed = true;
        //Even though this isn't required as we're interfacing with it by reference. Just for good measure
        this.events.set(event.id, event);
        this.persistEvent(event)
        this.eventEmitter.emit(EVENTS_UPDATED, event);
        if (fs.existsSync(path.join(this.persistentLocation, event.id))) {
            fs.rmSync(path.join(this.persistentLocation, event.id));
        }
    }

    /**
     * @param {*} listener
     * @public
     */
    onEventRaised(listener) {
        this.eventEmitter.on(EVENT_RAISED, listener);
    }

    /**
     * @param {*} listener
     * @public
     */
    onEventsUpdated(listener) {
        this.eventEmitter.on(EVENTS_UPDATED, listener);
    }

    /**
     * @param {import("./valetudo_events/events/ValetudoEvent")} event
     * @param {import("./valetudo_events/handlers/ValetudoEventHandler").INTERACTIONS} interaction
     */
    async interact(event, interaction) {
        if (!this.eventHandlerFactory) {
            throw new Error("Missing Event handler Factory");
        }

        if (event.processed === true) {
            throw new Error("Event is already processed");
        }

        const handler = this.eventHandlerFactory.getHandlerForEvent(event);

        if (handler) {
            const result = await handler.interact(interaction);

            if (result === true) {
                this.setProcessed(event.id);
            }
        } else {
            // reloading the events with handlers does not work right now...
            this.setProcessed(event.id);
            // throw new Error("Missing Handler for Event: " + event.__class);
        }
    }

}

const LIMIT = 50;
const EVENT_RAISED = "event_raised";
const EVENTS_UPDATED = "events_updated";

module.exports = ValetudoEventStore;
