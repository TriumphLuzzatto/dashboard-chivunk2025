// src/services/kommoService.ts
import axios from 'axios';

const KOMMO_SUBDOMAIN = process.env.KOMMO_SUBDOMAIN as string;
const KOMMO_TOKEN = process.env.KOMMO_TOKEN as string;

const KOMMO_API_URL = `https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4`;

export async function fetchLeads() {
  let leads: any[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= 5) {
    const response = await axios.get(`${KOMMO_API_URL}/leads?with=contacts&page=${page}`, {
      headers: { Authorization: `Bearer ${KOMMO_TOKEN}` },
    });

    const data = response.data as any; // <<<<<<<<<<< AQUI FORÇA O TIPO

    if (data._embedded?.leads) {
      leads = leads.concat(data._embedded.leads);
      hasNext = Boolean(data._links?.next);
      page++;
    } else {
      hasNext = false;
    }
  }

  return leads;
}