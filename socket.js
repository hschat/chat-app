class Socket {

    constructor() {
        //Singelton
        if (Socket.singelton === undefined) {
            Socket.singelton = this;
        } else {
            return Socket.singelton;
        }
        this.connection;
        this.url = 'wss://hsc-backend.herokuapp.com/';
        this.protocol= 'hsc-protocol';
        this.connection = new WebSocket(this.url, this.protocol);
        this.name;
    }

    static getInstance() {
        return Socket.singelton;
    }

    createConnection(){

    }

    getConnection(){
        return this.connection;
    }

    setName(name){this.name=name;}
    getName(){return this.name;}
}export default Socket;