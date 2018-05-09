const jwt  = require('jsonwebtoken');
const request = require('request-promise-native');

const GOOGLE_TOKEN_AUDIENCE = 'https://accounts.google.com/o/oauth2/token';
const GOOGLE_AUTH_TOKEN_URI = 'https://accounts.google.com/o/oauth2/token';
const ONE_HOUR_IN_SECONDS = 60 * 60;
const JWT_ALGORITHM = 'RS256';

let refreshToken = require('./futures-ai-firebase-adminsdk-b5f08-ae806ba21a.json');

function createAuthJwt_(){
  const claims = {
    scope: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/firebase.database',
      'https://www.googleapis.com/auth/firebase.messaging',
      'https://www.googleapis.com/auth/identitytoolkit',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  // This method is actually synchronous so we can capture and return the buffer.
  return jwt.sign(claims, refreshToken.private_key, {
    audience: GOOGLE_TOKEN_AUDIENCE,
    expiresIn: ONE_HOUR_IN_SECONDS,
    issuer: refreshToken.client_email,
    algorithm: JWT_ALGORITHM,
  });
}


let token = createAuthJwt_();
const postData = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3A' +
      'grant-type%3Ajwt-bearer&assertion=' +
      token;

const options = {
  method: 'POST',
  url: GOOGLE_AUTH_TOKEN_URI,
  body:postData, 
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length,
  },
  transform: (body) => {
    return JSON.parse(body);
  }
};
// https://firestore.googleapis.com/v1beta1/{document.name=projects/*/databases/*/documents/*/**}

const body = {
 "fields": {
  "2018-05-09T04:41:13+08:00": {
   "mapValue": {
    "fields": {
     "Position": {
      "integerValue": "1"
     },
     "Price": {
      "integerValue": "10967"
     },
     "Profit": {
      "stringValue": "NA"
     },
     "Status": {
      "stringValue": "Buy"
     }
    }
   }
  }
 }
};


request(options)
  .then( (body) => {
    console.log(body);
    let a = 'https://firestore.googleapis.com/v1beta1/projects/futures-ai/databases/(default)/documents/test_strategies/hello?currentDocument.exists=true&key='
      console.log(a);
    request({
      method: 'PATCH',
      url: a,
      auth: {
        'bearer': body.access_token
      }

    }).catch(err => {
      console.log(err.message);
    })
  })
  .catch((err)=> {
    console.log(err);
  });
