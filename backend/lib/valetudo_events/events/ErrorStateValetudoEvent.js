const DismissibleValetudoEvent = require("./DismissibleValetudoEvent");

class ErrorStateValetudoEvent extends DismissibleValetudoEvent {
    /**
     *
     *
     * @param {object}   options
     * @param {object}  options.message
     * @param {object}  options.mapState
     * @class
     */
    constructor(options) {
        super({});

        this.message = options.message;
        this.mapState = options.mapState;
    }
}

module.exports = ErrorStateValetudoEvent;
