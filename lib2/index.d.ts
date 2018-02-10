export interface IHassState {
    entity_id: String,
    last_changed: String,
    last_updated?: String,
    state: String
}

export interface IHassConfig {
    components: String[],
    config_dir: String,
    elevation: Number,
    latitude: Number,
    location_name: String,
    longitude: String,
    time_zone: String,
    unit_system: {
        length: String,
        mass: String,
        temperature: String,
        volume: String
    },
    version: String,
    whitelist_external_dirs: Array
}

export interface IConfig {
    host: String,
    port?: Number
    username?: String,
    password?: String
}