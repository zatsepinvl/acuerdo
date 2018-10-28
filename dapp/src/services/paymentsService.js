import web3Service from "./web3Service";
import moment from 'moment';
import httpClient from '../client/httpClient';
import channelService from './channelService';

class paymentsService {

    async savePayment(payment) {
        const {channelId, value} = payment;
        const createdAt = moment();
        const paymentId = await this.getPaymentId(payment);
        const senderSignature = await web3Service.sign(paymentId);
        return httpClient.payments.save({
            paymentId,
            channelId,
            value,
            createdAt,
            senderSignature
        });
    }

    async signPayment(payment) {
        const {channelId, paymentId} = payment;
        const signature = await web3Service.sign(paymentId);
        return httpClient.payments
            .signByRecipient({channelId, paymentId, signature})
            .then(() => signature);
    }

    async getPaymentId({channelId, value}) {
        return channelService.getContract()
            .methods.getPaymentId(channelId, value.toFixed())
            .call();
    }

}

export default new paymentsService();