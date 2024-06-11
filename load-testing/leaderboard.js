import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s'
//  scenarios: {
//         constant_vus: {
//             executor: 'constant-vus',
//             vus: 1000,
//             duration: '30s', // Durasi total pengujian, dapat disesuaikan
//         },
// },
 
}
export default (data) => {

    http.get('http://213.35.108.137:31707/scoring/api/v1/scoring/666797a34ac253b39171182b/leaderboard',  {
      headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpbnRhbmdicyIsImlhdCI6MTcxODA2NTE0MSwiZXhwIjoxNzE4MDY2MDQxLCJzdWIiOiJkOWFmYmQ1Yy0wMjBmLTRjZTQtOGY4Mi01MDViMzI5OGE0YzUifQ.AZeNFVigXTuBE3-IsieYYiFj5US0BxjWNHKS2b5bLtWhjhObnp2b-WJYQluMp2xoEkndYh9kvR7D1Uq1fr8cEwLgASTUvmlTLGn1YtCk-SWn2xqsPKT4aoQ9bLQ0kgkw4fk9hRtQGGtMFu9vPgf47Cw4CAhNhBAzbMQ8nzO3y4ndtvLG'
      }
    });


    sleep(1);
};