import axios from 'axios';

const api = '/api';

const get = (url) => axios.get(`${api}/${url}`)
    .then(response => response.data);

const post = (url, body) => axios.post(`${api}/${url}`, body)
    .then(response => response.data);

const channels = {
    getAllByUser: (username) => get(`/channels/users/${username}`),
    getById: (channelId) => get(`/channels/${channelId}`),
    save: (channel) => post('/channels', channel),
    contract: () => get(`/web3/contracts/channels`)
};

export {
    channels
}