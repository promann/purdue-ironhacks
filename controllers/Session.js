module.exports = class Session {
    static isAuthenticated (lien) {
        return Session.getUser(lien);
    }
    static getUser (lien) {
        return lien.getSessionData("user");
    }
};
