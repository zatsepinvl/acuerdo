import {action, computed, flow, observable} from 'mobx';
import moment from 'moment';

import channelService from "../services/channelService";
import paymentsService from "../services/paymentsService";
import web3Service from "../services/web3Service";
import httpClient from "../client/httpClient";
import {OPENED} from "../consts/channelsSatutes";
import channelEventService from "../services/channelEventService";

class channelsStore {
    @observable channel;
    @observable loaded;

    @computed
    get isSender() {
        return this.channel.sender === web3Service.account;
    }

    @computed
    get isRecipient() {
        return this.channel.recipient === web3Service.account;
    }

    @computed
    get isActive() {
        return this.channel.status === OPENED;
    }

    @computed
    get payments() {
        return this.channel.payments.slice()
            .sort((a, b) => moment(b.createdAt).diff(a.createdAt));
    }

    constructor() {
        channelEventService.subscribe(event => {
            if (this.loaded) {
                this.loadChannel(this.channel.channelId);
            }
        });
    }

    @action
    reset() {
        this.channel = undefined;
        this.loaded = false;
    }

    loadChannel = flow(function* (channelId) {
        this.channel = yield channelService.getChannelById(channelId);
        this.loaded = true;
    }).bind(this);

    savePayment = flow(function* (payment) {
        const result = yield paymentsService.savePayment(payment);
        this.channel.payments.push(result);
    }).bind(this);

    signPayment = flow(function* (payment) {
        payment.recipientSignature = yield paymentsService.signPayment(payment);
    }).bind(this);

    closeChannel = flow(function* (payment) {
        console.log(payment);
        const channelId = this.channel.channelId;
        const txHash = yield channelService.closeChannel({
            channelId: channelId,
            paymentId: payment.paymentId,
            value: payment.value,
            signature: this.isRecipient ? payment.senderSignature : payment.recipientSignature
        });
        const transaction = {
            hash: txHash,
            channelId: channelId,
            from: this.channel.sender,
            to: channelService.address,
            event: 'CLOSE_CHANNEL'
        };
        const sendResult = yield httpClient.channels.close({channelId, transaction});
        this.channel.transactions.push(transaction);
        return sendResult;
    }).bind(this);
}

export default new channelsStore();