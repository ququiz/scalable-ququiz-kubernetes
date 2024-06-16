import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
stages: [
		{ duration: '1m', target: 200 }, // ramp up
		{ duration: '3m', target: 200 }, // stable
		{ duration: '1m', target: 500 }, // ramp up
		{ duration: '3m', target: 500 }, // stable
		{ duration: '1m', target: 800 }, // ramp up
		{ duration: '3m', target: 800 }, // stable
		{ duration: '20s', target: 0 }, // ramp-down to 0 users
	],
}
export default (data) => {

   const res=   http.get('http://213.35.108.137:31707/scoring/api/v1/scoring/666835db76ecdc5964fc12e5/leaderboard',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODUzMjMyMiwiZXhwIjoxNzE4NTMzMjIyLCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AJHz3aNWQgCmoJO9ioupb6Y-nCR2KGRl0uEwnj4gCJLR64MEKCN_ua1UGUWErIe6t5Hn7QHkL7Oqsms8o8lyy_3YAG-oFic9mic-g-RnA56FKkuZVQJSvlW2gBSsXHk50j-ySFC461HoFEE2jYObBniOCkkwSkEGmvREUPnJGpxhybEJ'
      }
    });
     check(res, { '200': (r) => r.status === 200 });

    sleep(1);
};