import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 900,
  duration: '30s'

 
}
export default (data) => {

    http.get('http://213.35.108.137:31707/quiz-query/api/v1/quiz',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODA2MjE4OSwiZXhwIjoxNzE4MDYzMDg5LCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AMkubzhrTq-j9rCpWt4wHbl9G8JMJeZMeqX01XlsjS4bFeogWcq4GnSdqMjs4Dwx_hyqz1eEyFEeUjloCp9AwV3CAI1H1dY0io2nRAQ-REQLhAaHqMbMfWN176Z-E5WNFI0oX-VMDY5xQH_l8LSOOMrxRxtxNAV6l2lBuQcCpS0pcm2y'
      }
    });


    sleep(1);
};