const CapabilityRouter = require("./CapabilityRouter");

class BasicControlCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        const methodMap = {
            "start": () => {
                const cleaning_history = this.config.get("cleaning_history");
                cleaning_history.append(this.capability.robot.state.map);
                this.config.set("cleaning_history", cleaning_history);
                this.config.persist()
                return this.capability.start();
            },
            "stop": () => {
                return this.capability.stop();
            },
            "pause": () => {
                return this.capability.pause();
            },
            "home": () => {
                return this.capability.home();
            }
        };

        this.router.put("/", this.validator, async (req, res) => {
            const method = methodMap[req.body.action];

            if (method) {
                try {
                    await method();
                    res.sendStatus(200);
                } catch (e) {
                    this.sendErrorResponse(req, res, e);
                }
            } else {
                res.sendStatus(400);
            }
        });
    }
}

module.exports = BasicControlCapabilityRouter;
