/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import * as functions from 'firebase-functions'
import { google } from "googleapis";
import SheetApi, {Ranges} from "./sheet"
import * as admin from "firebase-admin";
import Student from './student';
// if you need to use the Firebase Admin SDK, uncomment the following:
// import * as admin from 'firebase-admin'


// Create and Deploy Cloud Function with TypeScript using script that is
// defined in functions/package.json:
//    cd functions
//    npm run deploy
const APChemID = "1GoROrqRqCu1Iho8u2Lt7cot_N181IJiocPpnDzb1ZLg";
const HONORSChemID = "17_ngMtVuabYISSkPmboTPxxXJ5vbpts-khcRlzZW-1M";
const sheet  = google.sheets("v4");
const key = require("./key.json");


const gapiClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  null
)
const authPromise = gapiClient.authorize();

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const firestoreSettings = {
  timestampsInSnapshots:true,
}
db.settings(firestoreSettings);

enum classes {
  AP = "ap",
  HONORS = "honors"
}

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!\n\n');
});

export const syncSheet2Database = functions.https.onRequest(async (request, response) => {
  await authPromise;
  const sheetAPI_AP = new SheetApi(gapiClient, APChemID);
  //response.send(sheetAPI);
  // await sheetAPI.getData(Ranges.firstName).then((result) => {
  //   response.send(result);
  // });
  await sheetAPI_AP.loadLeaderBoard().then((results) => {
    const apLogRef = db.collection(classes.AP).doc("students").collection("studentsLog").doc(Date.now().toString());
    apLogRef.set(toPlainObject(results)).then((res) => {
      console.log("DONE!");
      console.log(res)
      response.send("Success");
    });
  })
});

//TODO: fix it 
// export const syncSheet2DatabaseHonors = functions.https.onRequest(async (request, response) => {
//   await authPromise;
//   const sheetAPI_HONORS = new SheetApi(gapiClient, HONORSChemID);
//   //response.send(sheetAPI);
//   // await sheetAPI.getData(Ranges.firstName).then((result) => {
//   //   response.send(result);
//   // });
//   // await sheetAPI_HONORS.loadLeaderBoard().then((results) => {
//   //   const honorsLogRef = db.collection(classes.HONORS).doc("studentsLog").collection(Date.now().toString()).doc("students");
//   //   //honorsLogRef.set(toPlainObject(results));
//   //   //console.log(Date.now().toString());
//   //   response.send(results);
//   //   //response.send("done!");
//   // })
//   sheetAPI_HONORS.testGet("Rank Order Leaderboard");
// });

// // export const testAddData = functions.https.onRequest((req, resp) => {
// //   addStudent("ap", "Bob", "gg");
// // })

function toPlainObject(students: Student[]) {
  const obj: object = {students};
  return obj;
}

function addStudent(studentType: string, firstName: string, lastName: string) {
  const apStudentRef = db.collection(studentType).doc("students");
  apStudentRef.set({
    first: firstName,
    last: lastName,
  });
}
