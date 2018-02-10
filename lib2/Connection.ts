import * as EventSource from 'eventsource';
import * as request from 'request-promise-native';
import {IConfig} from "../index";

export default class Connection {
    private host: String;
    private port: Number;
    private username: String;
    private password: String;

    private es: EventSource;

    constructor(data: IConfig) {
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

    private async connect() {
        return new Promise((resolve, reject) => {
            this.es = new EventSource(this.streamUrl);

            this.es.onopen = () => {
                resolve();
            };

            this.es.onerror = (err) => {
                reject(err);
            };
        })
    }

    public async api(url: String) {
        return JSON.parse(await request(`${this.apiUrl(url)}`));
    }
}