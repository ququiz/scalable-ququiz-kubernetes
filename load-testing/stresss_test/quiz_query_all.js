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

   const res=  http.get('http://213.35.108.137:31707/quiz-query/api/v1/quiz',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODUzMzQ4OCwiZXhwIjoxNzE4NTM0Mzg4LCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AL8D3rOXxATXn84gjP8pHpHyTUvcaDyVaMdxCcMNk18F1ZbQaS_wUlcuvvc1PGHdAnkMKFHlD3L1VpeL_JLoe7mtAcjGoKYO8PrnyGDE9ptZusJP8llgcvwbuDRjiovCi3JGdAUZgKd2szRYzTkJGI8xFZpXsEPRbZvm6Pqr_aJlP8xA'
      }
    });

 check(res, { '200': (r) => r.status === 200 });
    sleep(1);
};