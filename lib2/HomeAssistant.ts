///<reference path="../node_modules/@types/ramda/index.d.ts"/>
import * as EventSource from 'eventsource';
import * as request from 'request-promise-native';
import * as R from 'ramda';

export interface Config {
    host: String,
    port?: Number
    username?: String,
    password?: String
}

export enum EntityTypes {
    light = "light",
    media = "media"
}

export enum EntityCapabilities {
    toggle
}

export interface Entity {
    entity_id: String,
    last_changed: String,
    last_updated?: String,
    state: String
}

export interface Light extends Entity {
}

export interface Media extends Entity {
}

export class HomeAssistant {
    private host: String;
    private port: Number;
    private username: String;
    private password: String;

    constructor(data: Config) {
        this.host = data.host;
        this.port = data.port;
        this.username = data.username;
        this.password = data.password;
    }

    private get streamUrl(): String {
        return `http://${this.host}:${this.port}/api/stream?api_password=${this.password}`;
    }

    private apiUrl = (path: String) =>
        `http://${this.host}:${this.port}/api/${path}?api_password=${this.password}`;

    public async api(url: String) {
        return JSON.parse(await request(this.apiUrl(url)));
    }

    public update(entity, value) {
        console.log("update ", entity, value);
    }
}

export const fetchEntities: ((hass: HomeAssistant) => Promise<Entity[]>) = async (hass) => await hass.api(`states`);
export const fetchEntity = (hass: HomeAssistant): ((entity_id: string) => Promise<Entity>) =>
    async (entity_id) => await hass.api(`states/${entity_id}`);

export const byType = (type: EntityTypes): ((entities: Entity[]) => Entity[]) =>
    R.filter(
        R.propSatisfies(
            (x: string) => x.startsWith(<string>type),
            'entity_id'
        )
    );

export const byCapability = (capability: EntityCapabilities): ((entities: Entity[]) => Entity[]) => {
    let result;

    switch (capability) {
        case EntityCapabilities.toggle:
            result = R.filter(
                R.propSatisfies(
                    (x: string) => x.startsWith(<string>EntityTypes.light) || x.startsWith(<string>EntityTypes.media),
                    'entity_id'
                )
            );
            break;

        default:
            result = () => [];
            break;
    }

    return result;
};

export const turnOn = (hass: HomeAssistant): ((entities: Entity[]|Entity) => void) =>
    R.ifElse(
        R.is(Array),
        R.forEach(e => hass.update(e, 'on')),
        e => hass.update(e, 'on')
    );

export const turnOff = (hass: HomeAssistant): ((entities: Entity[]|Entity) => void) =>
    R.ifElse(
        R.is(Array),
        R.forEach(e => hass.update(e, 'off')),
        e => hass.update(e, 'off')
    );

/*
export const connect = (config: Config) => new Promise((resolve, reject) => {
    const es = new EventSource(this.streamUrl);

    es.onopen = () => {
        resolve(es);
    };

    es.onerror = (err) => {
        reject(err);
    };
});
*/