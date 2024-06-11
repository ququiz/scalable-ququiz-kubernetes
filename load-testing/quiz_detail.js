import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s'

 
}
export default (data) => {

    http.get('http://213.35.108.137:31707/quiz-query/api/v1/quiz/66679392de5ecb524dd472fb',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer  eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODA2Mzk3NiwiZXhwIjoxNzE4MDY0ODc2LCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AKeCaFJZe_tlSd_iDy_lbXiEeMYgXXfB0b0vQRwFjfDnxR7zk_eulcRa1bmMOJ_l3woO1Ky_21Cm0GSHm00KqADkAN59FPRh2lTbGgigXwtT-fzYo3f3UERyG_YQ4KtJ9vhxBWv5XN8IMyVg9Au8MlbRxkxav1rpDt-fQ5Qo-AC6VIOh'
      }
    });


    sleep(1);
};