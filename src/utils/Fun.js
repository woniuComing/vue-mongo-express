const storage = {
    set(key, value) {
        sessionStorage.setItem(key, value);
    },
    get(key) {
        return sessionStorage.getItem(key);
    },
    remove(key) {
        sessionStorage.removeItem(key);
    }
}

export { storage };