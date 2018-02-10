import Connection from "./Connection";

export default abstract class Entity {
    protected conn;
    public entity_id: String;

    constructor(conn: Connection, data: any) {
        this.conn = conn;
        this.entity_id = data.entity_id;
    }
}