import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 700,
  duration: '30s'
 
};
function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function setup(){
    const totalContact = 10000;
    const data = [];
    for (let i = 0; i < totalContact; i++) {
        data.push({
            "fullname": `User${i}`,
            "email": `testing-${i}@gmail.com`,
            "username": `username-${i}`,
            "password": `Password-${i}23(`,
        })
    }
    return data;
}

export default (data) => {

    const user = {
          "username": "lintangbs",
        "password": "Lintang123("
    }
    http.post('http://213.35.108.137:31707/auth/authentications', JSON.stringify(user), {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
      }
    });


    sleep(1);
};