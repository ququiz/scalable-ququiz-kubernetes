import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s'

 
}
export default (data) => {

    http.get('http://213.35.108.137:31707/quiz-query/api/v1/quiz/666835db76ecdc5964fc12e5/questions',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODEwNTcyNCwiZXhwIjoxNzE4MTA2NjI0LCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.Ad2TG1bG45Hz8LYeHuseANUcgP3EyNXt0FET2xFl7b-HaMJJFuWJv7mr5VFCuK1lOqfDaQNWfTomb2FJFehfSfUYACsD8GBVsK9fLCXxpUOL5nn0PBxREqYsf61hoc3LRUexOY9QKwD-iKLY03TYmF-AUyBdSMXQWiTPWMoxYPMXhzdU'}
    });

    sleep(1);
};