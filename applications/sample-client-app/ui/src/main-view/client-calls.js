import axios from 'axios';

export function makePassthroughCall(payload, delay, throw_exception = false) {
  // const url = "/passthrough/messages"
  const url = "http://localhost:8080/passthrough/messages"
  return axios.post(url, {payload: payload, delay: delay, throw_exception});
}
