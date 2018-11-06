import web3Service from './web3Service';
import httpClient from "../client/httpClient";

const SIGNED_MESSAGE = 'Acuerdo';

class authService {

    logout() {
        return httpClient.auth.logout();
    }

    login() {
        return this._checkLogin()
            .then(({username}) => {
                if (username !== web3Service.account) {
                    this.logout().then(() => {
                        this.login();
                    });
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    return web3Service.sign(SIGNED_MESSAGE).then(signature => {
                        return httpClient.auth.login({
                            account: web3Service.account,
                            signature: signature,
                            signedMessage: SIGNED_MESSAGE
                        });
                    });
                }
                throw err;
            });
    }

    _checkLogin() {
        return httpClient.auth.me();
    }
}

export default new authService();
