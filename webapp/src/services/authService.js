import web3Service from './web3Service';
import httpClient from "../client/httpClient";

class authService {

    logout() {
        return httpClient.auth.logout();
    }

    async login() {
        const {requestId, signedMessage} = await httpClient.auth.loginRequest();
        const signature = await web3Service.sign(signedMessage);
        return httpClient.auth.login({
            account: web3Service.account,
            signature: signature,
            signedMessage: signedMessage,
            requestId: requestId
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
