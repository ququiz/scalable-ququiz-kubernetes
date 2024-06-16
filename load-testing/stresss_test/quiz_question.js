import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
stages: [
		{ duration: '1m', target: 200 }, // ramp up
		{ duration: '3m', target: 200 }, // stable
		{ duration: '1m', target: 500 }, // ramp up
		{ duration: '3m', target: 500 }, // stable
		{ duration: '1m', target: 700 }, // ramp up
		{ duration: '3m', target: 700 }, // stable
		{ duration: '20s', target: 0 }, // ramp-down to 0 users
	],
}
export default (data) => {

    const res = http.get('http://213.35.108.137:31707/quiz-query/api/v1/quiz/666ebd95d57e4a08f7ae4878/questions',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODUzMzU3MCwiZXhwIjoxNzE4NTM0NDcwLCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.Ab9NcKv-oRZU-E86z-L84dgrNpRJKV59FW_xcEYHJHFFQiGfRDwdlDXMrd4Wrz1RoEjVpJEBX6ue2lbNbLH9_wy1AGY3vYSWdSdUVONCqWg1N4uqm4twQQN5nH9zYIzUeBM6q5ESOsBt7ED4bLx53gKxPRMN84L9en8M05c8-Wd1yvfn'
            }
    });

     check(res, { '200': (r) => r.status === 200 });
    sleep(1);
};