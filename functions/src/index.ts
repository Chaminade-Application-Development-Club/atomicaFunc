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
// if you need to use the Firebase Admin SDK, uncomment the following:
// import * as admin from 'firebase-admin'


// Create and Deploy Cloud Function with TypeScript using script that is
// defined in functions/package.json:
//    cd functions
//    npm run deploy
const APChemID = "1GoROrqRqCu1Iho8u2Lt7cot_N181IJiocPpnDzb1ZLg";
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

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!\n\n');
});

export const syncSheet2Database = functions.https.onRequest(async (request, response) => {
  await authPromise;
  const sheetAPI = new SheetApi(gapiClient, APChemID);
  //response.send(sheetAPI);
  // await sheetAPI.getData(Ranges.firstName).then((result) => {
  //   response.send(result);
  // });
  await sheetAPI.loadLeaderBoard().then((results) => {
    response.send(results);
  })
});
