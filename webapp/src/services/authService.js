import web3Service from './web3Service';
import httpClient from "../client/httpClient";

const SIGNED_MESSAGE = 'Acuerdo';

class authService {

    logout() {
        return httpClient.auth.logout();
    }

    async login() {
        const signature = await web3Service.sign(SIGNED_MESSAGE);
        return httpClient.auth.login({
            account: web3Service.account,
            signature: signature,
            signedMessage: SIGNED_MESSAGE
        });
    }

    _me() {
        return httpClient.auth.me();
    }

    async getLoggedAccount() {
        try {
            return (await this._me()).username;
        }
        catch (error) {
            if (error.response.status === 401) {
                return undefined;
            }
            throw  error;
        }
    }
}

export default new authService();
