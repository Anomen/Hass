import {
    HomeAssistant, fetchEntities, filterLights, turnOn, filterMedia, byCapability,
    EntityCapabilities, fetchEntity
} from './lib2/HomeAssistant';
import * as R from 'ramda';


async function start() {
    try {
        const hass = new HomeAssistant({
            host: "localhost",
            port: 8123,
            password: "welcome"
        });

        console.log(await R.composeP(
            turnOn(hass),
            fetchEntity(hass)
        )("light.bureau__cloche"));

    } catch (e) {
        console.error(e);
    }
}

start();