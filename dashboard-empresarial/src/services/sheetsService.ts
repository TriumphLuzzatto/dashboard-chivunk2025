// src/services/sheetsService.ts
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = process.env.SHEET_ID;

const auth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

export async function updateSheet(dataMap: Record<string, any>) {
  const sheets = google.sheets({ version: 'v4', auth });

  const requests = Object.entries(dataMap).map(([date, data], i) => {
    return {
      range: `Sheet1!A${i + 2}:L${i + 2}`,
      values: [[date, data.whatsapp, '', '', '', '', data.instagram, '', '', '', '', data.agendamentos]],
    };
  });

  for (const r of requests) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: r.range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: r.values },
    });
  }
}