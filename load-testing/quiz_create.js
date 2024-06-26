import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 800,
  duration: '30s'
}

function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


export default () => {

    const quiz = {
         "title": `Distributed System ${createRandomString(6)}`,
        "start_time": "2024-06-08T10:00:07+07:00", // DATE
        "end_time": "2024-10-12T22:35:07+07:00", // DATE
        "questions": [{
            "question": "string",
            "type": "MULTIPLE", // ENUM("MULTIPLE", "ESSAY")
            "weight": 100,
            "choices": [
            {
                "text": "string",
                "is_correct": true // DEFAULT FALSE
            },
            {
                "text": "string2",
                "is_correct": false // DEFAULT FALSE
            }
            ]
        },
        {
            "question": "string",
            "type": "ESSAY", // ENUM("MULTIPLE", "ESSAY")
            "weight": 20,
            "essay_answer": "string" // Will be used if type is "ESSAY"
        }
  ]
    }

    http.post('http://213.35.108.137:31707/quiz-command/quiz/',JSON.stringify(quiz),  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODU0NjQxNiwiZXhwIjoxNzE4NTQ3MzE2LCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AaAyxff8eh_djhtEfrIRnoaxDyo7lbib9Y47wrMUJrulVEQZ8ujtVn5waiARlW1Ajwu-xqDfzfhYDEp3PxYAdgcRAQLaNRPnpku85zJvJzkprZhp6G7uYQqHUt9mKwyUEjbv3dbCQ2zAPbm005EWLxg7OOmtsNNrSsGnY9tP3Zti7p-J'
      }
    });

    sleep(1);
};