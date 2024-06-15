import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1500,
  duration: '30s'

 
}
export default (data) => {

    http.get('http://213.35.108.137:31707/quiz-query/api/v1/quiz/666835db76ecdc5964fc12e5',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer  eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODEwNTQ4NCwiZXhwIjoxNzE4MTA2Mzg0LCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AFx9-78OZoWiK-y9mHSmX6GAj-fYpSYizWSm3kVWU2vGrJQUWYWbqYT5PyL30RcWvm5t9yfCZmJWVDyPQFA-3m8fATd_hrb5jtVL7IZzqqKOKi_B0soNniaGMU3_XDkTSOeEek2_RDl8aV6CsXi8FYRuJRO1q48ENOVnpbgUS0gJSIi-'
      }
    });


    sleep(1);
};