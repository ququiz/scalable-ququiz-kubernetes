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

   const res=   http.get('http://213.35.108.137:31707/scoring/api/v1/scoring/6670000ee1799b70e375aa04/leaderboard',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODYxNjU5MywiZXhwIjoxNzE4NjE3NDkzLCJzdWIiOiJmNmUxN2IyZS03YjVjLTQxMWItOGQ5Mi0wYjdlZmEwOGFjYTcifQ.AXnS8tV-93opu4nteuM0elZuYM-X2vU1WU5P88FPD17v1cM-BylghYh2Ki_mzu6VJ4MPw3Wqjgxobj66Qm6Agi6oAMVUTm15FNDKCf9trfBl4ic5lMfCjfHwDQ24F_gUxker78jMH-Xan8yw-RvDhqm0GxhAOnvOz6EfyLZfNWSTNGUm'
      }
    });
     check(res, { '200': (r) => r.status === 200 });

    sleep(1);
};