# ABC EMPORIO — REGISTRATION MANAGEMENT GUIDE
## Organiser Access, Guest List Export & Data Management

---

## 1. Where Registrations Are Stored

All guest registrations submitted through the **Show & Tell Experience** website are securely processed by the Vercel Serverless API (`/api/register`) and saved to **Neon Postgres** in the `registrations` table.

Each guest record captures:
* **Full Name** (`full_name`)
* **Profession** (`profession`): Architect, Engineer, or Other
* **Role / Discipline** (`profession_other`): Specified if "Other" was selected
* **Company / Firm** (`company`)
* **Phone / WhatsApp Number** (`phone`): Normalized international format
* **Email Address** (`email`): Optional guest email
* **Event Identifier** (`event_key`): `show-and-tell-dar-es-salaam-2026`
* **Timestamp** (`created_at`): ISO timestamp of registration

---

## 2. Instant One-Click Excel / CSV Export (For Sales Managers)

To download the latest attendee list into **Microsoft Excel** or **Google Sheets** at any time:

1. Open your browser and navigate to:
   ```
   https://<your-deployed-domain>/api/export?token=ABC_SHOWTELL_2026&format=csv
   ```
   *(Replace `ABC_SHOWTELL_2026` with your custom `ORGANISER_EXPORT_TOKEN` if changed in Vercel).*
2. The browser will immediately download a file named `abc-showtell-registrations.csv`.
3. Double-click the file to open it in Microsoft Excel, Apple Numbers, or import it into Google Sheets.

The CSV includes the following column headers:
```
ID, Full Name, Profession, Discipline, Company, Phone, Email, Created At
```

---

## 3. JSON Data Endpoint (For Systems Integration)

To retrieve the guest list programmatically or inspect the total count:
```
https://<your-deployed-domain>/api/export?token=ABC_SHOWTELL_2026&format=json
```

**Example JSON Response:**
```json
{
  "ok": true,
  "total": 24,
  "registrations": [
    {
      "id": "reg_1792361221406_zx0jlv",
      "full_name": "David Chipperfield",
      "profession": "Architect",
      "profession_other": "",
      "company": "David Chipperfield Architects",
      "phone": "+255 791 261 881",
      "email": "david@chipperfield.com",
      "event_key": "show-and-tell-dar-es-salaam-2026",
      "created_at": "2026-10-18T22:07:01.406Z"
    }
  ]
}
```

---

## 4. Neon Postgres Cloud Console (For Database Administrators)

If you prefer direct database management:
1. Log in to your [Neon Console](https://console.neon.tech/) or Vercel Storage dashboard.
2. Select the `showtell` database and open the **SQL Editor**.
3. Run the following queries to view or analyze attendee demographics:

```sql
-- View all registered guests ordered by registration time
SELECT full_name, profession, company, phone, email, created_at
FROM registrations
ORDER BY created_at DESC;

-- Count attendees by profession
SELECT profession, COUNT(*) as guest_count
FROM registrations
GROUP BY profession;
```

---

## 5. Security and Privacy Safeguards

* **No Public Access:** The guest list is never exposed to public visitors. The export endpoint requires the secure token.
* **Honeypot Protection:** An invisible anti-spam honeypot field catches automated bots without disrupting real users.
* **Idempotency Lock:** Submissions with identical session IDs within quick succession are prevented from creating duplicate entries.
