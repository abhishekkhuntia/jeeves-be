interface AuthMem {
    uid: string,
    expiration: string
}

class AuthMemCache {
    private memCache: Map<string, AuthMem>; 
    constructor(initialVal?: Map<string, AuthMem>){
        this.memCache = initialVal || new Map();
    }
    get(token: string) {
        return this.memCache.get(token);
    }
    put(token: string, record: AuthMem){
        this.memCache.set(token, record);
    }

    delete(token: string) {
        this.memCache.delete(token);
    }
}

export default AuthMemCache;