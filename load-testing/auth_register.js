import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  // vus: 200,
  // duration: '30s'
    scenarios: {
        constant_vus: {
            executor: 'constant-vus',
            vus: 400,
            duration: '30s', // Durasi total pengujian, dapat disesuaikan
        },
    },
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
  // const vuIndex = __VU - 1; // indeks Virtual User saat ini (dimulai dari 0)
  // const userData = data[vuIndex]; // ambil data unik untuk setiap VU

    const user = {
        "fullname": `User${createRandomString(6)}`,
        "email": `testing-${createRandomString(6)}@gmail.com`,
        "username": `username-${createRandomString(6)}`,
        "password": `Password-${createRandomString(6)}23(`,
    }
    http.post('http://213.35.108.137:31707/auth/users', JSON.stringify(user), {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
      }
    });


    sleep(1);
};