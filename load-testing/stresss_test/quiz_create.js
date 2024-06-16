import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
 stages: [
		{ duration: '1m', target: 200 }, // ramp up
		{ duration: '3m', target: 200 }, // stable
		{ duration: '1m', target: 500 }, // ramp up
		{ duration: '3m', target: 500 }, // stable
		{ duration: '1m', target: 600 }, // ramp up
		{ duration: '3m', target: 600 }, // stable
		{ duration: '20s', target: 0 }, // ramp-down to 0 users
	],
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
        "end_time": "2024-09-12T22:35:07+07:00", // DATE
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

   const res =  http.post('http://213.35.108.137:31707/quiz-command/quiz/',JSON.stringify(quiz),  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODU1MDE3MCwiZXhwIjoxNzE4NTUxMDcwLCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AZrVSLYM_c_OoJiQspCV4AXk-Fhl-pktGcd8VAlu0uXaqNvSxLFhkFcFTku7XIP7yknKTA_CUpTuMo6lwv8XcjeeAPfgvYKdybGJggx6Yjro2i444MQgtaUQPY3_oG5mR0I96QZRfV5VzM4JrqMYF9u4zQrNqJJGPi8wjuBXKLBt1hKe'
      }
    });


    check(res, { '201': (r) => r.status === 201 });

    sleep(1);
};