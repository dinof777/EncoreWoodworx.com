/**
 * Encore Woodworx — form intake.
 *
 * Receives project inquiries and newsletter signups from encorewoodworx.com, writes each
 * to a tab in this spreadsheet, and emails a notification.
 *
 * Why this rather than posting to a Google Form: Google rejects programmatic POSTs to a
 * form's /formResponse endpoint (verified against two separate published forms, with a
 * byte-identical browser replay — every attempt returned 400). Apps Script web apps are
 * a supported POST target, so this cannot break the same way.
 *
 * ── SETUP ────────────────────────────────────────────────────────────────────────────
 * 1. Create a Google Sheet. Name it something like "Encore Woodworx — Intake".
 * 2. In that Sheet: Extensions → Apps Script. Delete the placeholder, paste this file.
 * 3. Set SHARED_SECRET below to a long random string. Keep it — the site needs it too.
 * 4. Set NOTIFY_EMAIL to wherever notifications should land.
 * 5. Deploy → New deployment → type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone            <-- required; "Anyone with Google account" will not work
 * 6. Authorise when prompted (it wants Sheets + Gmail on your behalf).
 * 7. Copy the /exec URL. The site needs that plus the secret:
 *      APPS_SCRIPT_INTAKE_URL=<the /exec url>
 *      APPS_SCRIPT_INTAKE_SECRET=<the same secret>
 *
 * Re-deploying after an edit: Deploy → Manage deployments → edit → New version. Reusing
 * the deployment keeps the URL stable; "New deployment" mints a different one.
 */

const SHARED_SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
const NOTIFY_EMAIL = 'dinof777@gmail.com';

const TABS = {
  project: {
    name: 'Project Inquiries',
    headers: ['Received', 'Name', 'Email', 'Message', 'Pieces in basket', 'Source'],
  },
  newsletter: {
    name: 'Newsletter',
    headers: ['Received', 'Name', 'Email', 'Source'],
  },
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' });
    }

    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }

    const type = body.type === 'newsletter' ? 'newsletter' : 'project';
    const now = new Date();
    const sheet = tabFor(type);

    if (type === 'newsletter') {
      sheet.appendRow([now, str(body.name), str(body.email), str(body.source)]);
      notify(
        'Newsletter signup — Encore Woodworx',
        ['Name:  ' + str(body.name), 'Email: ' + str(body.email)].join('\n')
      );
    } else {
      sheet.appendRow([
        now,
        str(body.name),
        str(body.email),
        str(body.message),
        str(body.basket),
        str(body.source),
      ]);
      notify(
        'New project inquiry — Encore Woodworx',
        [
          'Name:  ' + str(body.name),
          'Email: ' + str(body.email),
          '',
          str(body.message) || '(no message)',
          '',
          str(body.basket) ? 'Pieces in their basket:\n' + str(body.basket) : '(no basket)',
        ].join('\n')
      );
    }

    return json({ ok: true });
  } catch (err) {
    // Surface the failure to the caller so the site never claims a delivery it did not make.
    return json({ ok: false, error: String(err) });
  }
}

/** A GET is only ever a health check — never let it write anything. */
function doGet() {
  return json({ ok: true, service: 'encore-woodworx-intake' });
}

function tabFor(type) {
  const spec = TABS[type];
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(spec.name);
  if (!sheet) {
    sheet = ss.insertSheet(spec.name);
    sheet.appendRow(spec.headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, spec.headers.length).setFontWeight('bold');
  }
  return sheet;
}

function notify(subject, body) {
  try {
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  } catch (err) {
    // The row is already written, which is the durable part. A failed notification
    // must not fail the request.
    console.error('notify failed: ' + err);
  }
}

function str(v) {
  return v == null ? '' : String(v);
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
