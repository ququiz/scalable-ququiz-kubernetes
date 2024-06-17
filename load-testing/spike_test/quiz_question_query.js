import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
		{ duration: '30s', target: 3000 }, // ramp up
		{ duration: '2m', target: 3000 }, // stable
		{ duration: '30s', target: 0 }, // ramp-down to 0 users
	],
}
export default (data) => {

    const res = http.get('http://213.35.108.137:31707/quiz-query/api/v1/quiz/6670000ee1799b70e375aa04/questions',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODYxNjEzNCwiZXhwIjoxNzE4NjE3MDM0LCJzdWIiOiJmNmUxN2IyZS03YjVjLTQxMWItOGQ5Mi0wYjdlZmEwOGFjYTcifQ.ANX7do0C2SlB2BCpAuHoeOMSPdWRhAAo5dkFvGSRozcCjJQU1g51JjsZodB49g6KGivk55B9dPTEg94EyDOMBXrFAcSdMCK5mFTKd-7Ub45UetILdyxAJpc7R9HVfXymgC6QIZSmE5SbpZX10UvshZy53g8CcazLJ7uXM3wKHClcVMqW'
            }
    });

     check(res, { '200': (r) => r.status === 200 });
    sleep(1);
};