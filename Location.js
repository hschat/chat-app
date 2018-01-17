const GEO_HS = {
    middle: {
        latitude: 50.265014,
        longitude: 10.952138
    },
    topLeft:{
        latitude: 50.266132,
        longitude: 10.948818
    },
    topRight:{
        latitude: 50.266045,
        longitude: 10.953188,
    },
    bottomLeft:{
        latitude: 50.263796,
        longitude: 10.948533
    },
    bottomRight:{
        latitude: 50.264605,
        longitude: 10.953696,
    }
};
const RADIUS = 250;


let instance = null;

export default class Location {

    constructor(){
        if(!instance){ instance = this; }
    }

    async getOnHS() {
        let dis = await this.getDistanceBetweenLocAndHS();
        return new Promise.resolve({
            on_hs: dis < RADIUS,
            distance: dis
        });
    }

    /**
     * Returns a promise which resolvs the the distance between the current user and the HS(middle_point) in m
     */
    getDistanceBetweenLocAndHS() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition((position) => {
                let dis = this.getDistanceBetweenCoords(GEO_HS.middle.latitude, GEO_HS.middle.longitude, position.coords.latitude, position.coords.longitude);
                console.debug('Zwischen dir lat:' + position.coords.latitude + ' long:' + position.coords.longitude + ' und der HS liegen ' + dis + ' m');
                return resolve(dis);
            });
        });
    }

    /**
     * Returns the distance between two points in m
     * @param lat1 latitude coord 1
     * @param lon1 lonitude coord 1
     * @param lat2 latidude coord 2
     * @param lon2 lonitude coord 2
     * @return distance in m
     */
    getDistanceBetweenCoords(lat1, lon1, lat2, lon2) {
        let R = 6371; // Radius of the earth in km
        deg2rad = (deg) => {
            return deg * (Math.PI / 180)
        };
        let dLat = deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c) * 1000; // Distance in km
    }
}
