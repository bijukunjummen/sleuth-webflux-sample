import axios from 'axios';

export function makePassthroughCall(payload, delay) {
    const url = "/passthrough/messages"
    return axios.post(url, {payload: payload, delay: delay});
}
