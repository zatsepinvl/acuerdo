import axios from 'axios';

const api = '/api';

const responseConsumer = response => response.data;

const get = (url) => axios.get(`${api}/${url}`).then(responseConsumer);
const post = (url, body) => axios.post(`${api}/${url}`, body).then(responseConsumer);
const put = (url, body) => axios.put(`${api}/${url}`, body).then(responseConsumer);

const channels = {
    getAllByUser: (username) => get(`/channels/users/${username}`),
    getById: (channelId) => get(`/channels/${channelId}`),
    save: (channel) => post('/channels', channel),
    close: ({channelId, transaction}) => put(`/channels/${channelId}`, transaction),
    contract: () => get(`/web3/contracts/channels`)
};

const payments = {
    save: (payment) =>
        post(`/channels/${payment.channelId}/payments`, payment),
    signByRecipient: ({channelId, paymentId, signature}) =>
        put(`/channels/${channelId}/payments/${paymentId}`, {signature})
};

const auth = {
    login: login => post(`/auth/login`, login),
    logout: () => post(`/auth/logout`),
    me: () => get(`/auth/me`)
};


export default {
    channels,
    payments,
    auth
}