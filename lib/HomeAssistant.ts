import * as EventSource from 'eventsource';
import * as request from 'request-promise-native';
import Connection from './Connection';
import Light from "./Light";
import Entity from "./Entity";

export default class HomeAssistant {
    private _conn: Connection;
    private _entities: Entity[];

    constructor(data: IConfig) {
        this._conn = new Connection(data);
    }

    public async get config(): IHassConfig {
        return this._conn.api('config');
    }

    public async getEntities(): Entity[] {
        if (this._entities) {
            return this._entities;
        }

        this._entities = [];

        // Fetch the states
        const states: IHassState[] = await this._conn.api('states');

        // Create the right entities to interact with
        states.forEach(state => state.entity_id.startsWith('light') &&
            this._entities.push(new Light(this._conn, state)));

        return this._entities;
    }

    public async get(entityId: String): IHassState {
        return this._conn.api(`states/${entityId}`);
    }

    public async getLights(): Light[] {
        const entities = await this.getEntities();
        return entities.filter(e => e instanceof Light);
    }
}