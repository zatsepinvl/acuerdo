class storageService {
    get(key, def) {
        return JSON.parse(localStorage.getItem(key)) || def;
    }

    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export default new storageService();