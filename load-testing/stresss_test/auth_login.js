import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
	stages: [
		{ duration: '1m', target: 200 }, // ramp up
		{ duration: '3m', target: 200 }, // stable
		{ duration: '1m', target: 500 }, // ramp up
		{ duration: '3m', target: 500 }, // stable
		{ duration: '1m', target: 600 }, // ramp up
		{ duration: '3m', target: 600 }, // stable
		{ duration: '20s', target: 0 }, // ramp-down to 0 users
	],
};


export default (data) => {

    const user = {
          "username": "lintangbs",
        "password": "Lintang123("
    }
   const res=  http.post('http://213.35.108.137:31707/auth/authentications', JSON.stringify(user), {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
      }
    });
    check(res, { '200': (r) => r.status === 200 });
    sleep(1);
};