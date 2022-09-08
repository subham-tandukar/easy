import NepaliDate from "nepali-date-converter";
import React from "react";

export function GetEnglishDate(date) {
  let nDate = new NepaliDate(date);

  let eDate = nDate.getAD();

  let enMonth = eDate.month + 1;
  let enM = enMonth < 10 ? `0${enMonth}` : enMonth;

  let enDat = eDate.date < 10 ? `0${eDate.date}` : eDate.date;
  return `${eDate.year}-${enM}-${enDat}`;
}

export function GetNepaliDate(date) {
  const rDate = Date.parse(date);
  const nepDate = new NepaliDate(rDate).getBS();

  var cm = nepDate.month + 1;
  let zm = cm < 10 ? `0${cm}` : cm;
  // 
  var cd = nepDate.date;
  let zd = cd < 10 ? `0${cd}` : cd;
  let strDate = nepDate.year + "/" + zm + "/" + zd;
  // 
  return strDate;
}

export function GetTwelveHourFormatTime(time) {
  let tm = time.slice(0, 2);
  // 
  var suffix = tm >= 12 ? "PM" : "AM";
  var hours = ((parseInt(tm) + 11) % 12) + 1;
  var cHours = hours < 10 ? (hours = `0${hours}`) : hours;
  var cTime = `${cHours}:${time.slice(3, 5)}:00 ${suffix} `;

  return cTime;
}

export function GetCurrTime() {
  let date = new Date();
  // 
  let cur_time = date.toTimeString().split(" ")[0];
  return cur_time;
}

export function GetToDate() {
  let date = new NepaliDate().getBS();
  let tm = date.month + 1 < 10 ? `0${date.month + 1}` : `${date.month + 1}`;
  let td = date.date < 10 ? `0${date.date}` : `${date.date}`;
  return `${date.year}/${tm}/${td}`;
}

export function GetFromDate() {
  let date = new NepaliDate().getBS();
  let tdate = date.year;
  let tm = date.month;
  if (tm === 0) {
    tdate = tdate - 1;
    tm = 11;
  } else {
    tm = tm < 10 ? `0${date.month}` : `${date.month}`;
  }
  let td = date.date < 10 ? `0${date.date}` : `${date.date}`;
  return `${tdate}/${tm}/${td}`;
}

export function GetCurrMonth() {
  let date = new NepaliDate().getBS();
  return date.month + 1 < 10 ? `0${date.month + 1}` : `${date.month + 1}`;
}

export function GetCurrYear() {
  let date = new NepaliDate().getBS();
  return `${date.year}`;
}

export function GetEngCurrYear() {
  let date = new Date();
  return `${date.getFullYear()}`;
}
