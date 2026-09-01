/**
 * Baby Gender Reveal Quiz — Google Sheet backend
 * -------------------------------------------------
 * Stores every guess as a row in the bound spreadsheet and serves the
 * scoreboard / parent-only roster to the static site on GitHub Pages.
 *
 * SETUP
 *  1. Create a Google Sheet. Extensions -> Apps Script, paste this file.
 *  2. (Optional) Script Properties -> add PARENT_PIN and/or ACTUAL_GENDER.
 *     Defaults: PARENT_PIN = "1991", ACTUAL_GENDER = "boy".
 *  3. Deploy -> New deployment -> type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Copy the /exec URL — that is your VITE_SHEET_API_URL.
 *  4. Re-deploy (Manage deployments -> edit -> new version) after any edit.
 */

var SHEET_NAME = 'Guesses';
var HEADERS = ['id', 'timestamp', 'name', 'relationship', 'choice', 'message', 'isCorrect'];

function props_() {
  return PropertiesService.getScriptProperties();
}

function getPin_() {
  return String(props_().getProperty('PARENT_PIN') || '1991').trim();
}

function actualGender_() {
  return String(props_().getProperty('ACTUAL_GENDER') || 'boy').trim().toLowerCase();
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function readAll_() {
  var sh = sheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var rows = values.map(function (r) {
    return {
      id: String(r[0]),
      timestamp: Number(r[1]) || 0,
      name: String(r[2] || ''),
      relationship: String(r[3] || ''),
      choice: String(r[4] || ''),
      message: String(r[5] || ''),
      isCorrect: r[6] === true || String(r[6]).toLowerCase() === 'true',
    };
  });
  // newest first
  rows.sort(function (a, b) { return b.timestamp - a.timestamp; });
  return rows;
}

function stats_(rows) {
  var total = rows.length;
  var boy = rows.filter(function (r) { return r.choice === 'boy'; }).length;
  var girl = rows.filter(function (r) { return r.choice === 'girl'; }).length;
  return {
    total: total,
    boyVotes: boy,
    girlVotes: girl,
    boyPercentage: total ? Math.round((boy / total) * 100) : 0,
    girlPercentage: total ? Math.round((girl / total) * 100) : 0,
  };
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function pinOk_(provided) {
  return String(provided || '').trim() === getPin_();
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = p.action || 'list';

  if (action === 'verifyPin') {
    return json_({ success: pinOk_(p.pin) });
  }

  // action === 'list'
  var rows = readAll_();
  var stats = stats_(rows);
  if (pinOk_(p.pin)) {
    return json_({ authorized: true, submissions: rows, stats: stats });
  }
  return json_({ authorized: false, submissions: [], stats: stats });
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ error: 'Invalid request body' });
  }

  var action = body.action;
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (action === 'submit') {
      var name = String(body.name || '').trim();
      var choice = String(body.choice || '').trim();
      if (!name) return json_({ error: 'Name is required' });
      if (choice !== 'boy' && choice !== 'girl') return json_({ error: "Choice must be 'boy' or 'girl'" });

      var submission = {
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        name: name,
        relationship: String(body.relationship || '').trim(),
        choice: choice,
        message: String(body.message || '').trim(),
        isCorrect: choice === actualGender_(),
      };
      sheet_().appendRow([
        submission.id, submission.timestamp, submission.name,
        submission.relationship, submission.choice, submission.message,
        submission.isCorrect,
      ]);
      return json_({ submission: submission, stats: stats_(readAll_()) });
    }

    if (action === 'changePin') {
      if (!pinOk_(body.currentPin)) return json_({ error: 'Current PIN is incorrect' });
      var newPin = String(body.newPin || '').trim();
      if (newPin.length < 4) return json_({ error: 'New PIN must be at least 4 characters' });
      props_().setProperty('PARENT_PIN', newPin);
      return json_({ success: true });
    }

    if (action === 'delete') {
      if (!pinOk_(body.pin)) return json_({ error: 'Parent authorization required' });
      var sh = sheet_();
      var last = sh.getLastRow();
      if (last >= 2) {
        var ids = sh.getRange(2, 1, last - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]) === String(body.id)) {
            sh.deleteRow(i + 2);
            break;
          }
        }
      }
      return json_({ success: true, stats: stats_(readAll_()) });
    }

    if (action === 'clearAll') {
      if (!pinOk_(body.pin)) return json_({ error: 'Parent authorization required' });
      var s = sheet_();
      var l = s.getLastRow();
      if (l >= 2) s.deleteRows(2, l - 1);
      return json_({ success: true, stats: stats_([]) });
    }

    return json_({ error: 'Unknown action' });
  } finally {
    lock.releaseLock();
  }
}
