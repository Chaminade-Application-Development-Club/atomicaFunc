'use strict';

import Student from "./student";
import { google } from "googleapis";

export enum Ranges {
  firstName = "Rank Order Leaderboard!F2:F",
  lastName = "Rank Order Leaderboard!G2:G",
  house = "Rank Order Leaderboard!I2:I",
  guild = "Rank Order Leaderboard!J2:J",
  xp = "Rank Order Leaderboard!N2:N",
  level = "Rank Order Leaderboard!P2:P",
  gold = "Rank Order Leaderboard!R2:R",
}

export default class SheetApi {
  private sheet = google.sheets("v4");
  private spreadsheetId: string;
  private auth: any;
  constructor(auth: any, sheetID: string) {
    console.log("start requesting");
    this.auth = auth;
    this.spreadsheetId = sheetID;
  }

  public async loadLeaderBoard() {
    let first = await this.getData(Ranges.firstName);
    let last = await this.getData(Ranges.lastName);
    let house = await this.getData(Ranges.house);
    let guild = await this.getData(Ranges.guild);
    let xp = await this.getData(Ranges.xp);
    let level = await this.getData(Ranges.level);
    let gold = await this.getData(Ranges.gold);
    return new Promise<Student[]>((resolve) => {
      let students: Student[] = [];
      for (let i = 0; i < first.length; i++) {
        let s: Student = {
          firstName: first[i],
          lastName: last[i],
          house: house[i],
          guild: guild[i],
          xp: xp[i],
          level: level[i],
          gold: gold[i],
        };
        if (students !== null) {
          students.push(s);
        } else {
          students = [s];
        }
      }
      resolve(students);
    });
  }

  // returns the data in array format
  public async getData(requestRange: string){
    return new Promise<string[]>((resolve) => {
      let results = Array<string>();
      this.sheet.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: requestRange,
        auth: this.auth,
      }).then((res: any) => {
        const vals = res.data.values;
        for (let f of vals) {
          if(typeof(f[0]) === "undefined") {
            f[0] = "None";
            results.push(f[0]);
          }
          else results.push(f[0]);
        }
        resolve(results);
      });
    });
  }

  public async testGet(requestRange: string){
    return new Promise<string[]>((resolve) => {
      let results = Array<string>();
      console.log(this.spreadsheetId);
      this.sheet.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: requestRange,
        auth: this.auth,
      }).then((res: any) => {
        // const vals = res.data.values;
        console.log("gg");
        // for (const f of vals) {
        //   results.push(f[0]);
        // }
        resolve(results);
      });
    });
  } 
}