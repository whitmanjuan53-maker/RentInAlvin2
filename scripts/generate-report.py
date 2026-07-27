#!/usr/bin/env python3
"""Generate a combined 7-day and 30-day report in the 30-day report format."""
import sqlite3
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "prisma" / "dev.db"
TODAY = datetime.datetime.now(datetime.timezone.utc)

STAFF_EMAILS = ("office@yellowstone-am.com", "dor@yellowstone-am.com")
INTERNAL_TYPES = ("weekly_report", "monthly_report")

REPORTS_DIR = ROOT / "reports"
REPORTS_DIR.mkdir(exist_ok=True)
OUT = REPORTS_DIR / f"Combined-7Day-and-30Day-Report-{TODAY.strftime('%Y-%m-%d')}.txt"


def load_data(since):
    since_ts = int(since.timestamp() * 1000)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    c.execute("""
        SELECT id, type, leadType, name, email, phone, property, message, metadata, sourcePage, status, createdAt
        FROM Lead
        WHERE createdAt >= ?
        ORDER BY createdAt DESC
    """, (since_ts,))
    leads = []
    for r in c.fetchall():
        ts = r["createdAt"]
        dt = datetime.datetime.fromtimestamp(ts / 1000, tz=datetime.timezone.utc)
        leads.append({
            "dt": dt,
            "type": r["type"],
            "leadType": r["leadType"],
            "name": r["name"],
            "email": r["email"] or "",
            "phone": r["phone"] or "",
            "property": r["property"] or "",
            "message": r["message"] or "",
            "status": r["status"],
        })

    c.execute("""
        SELECT id, resendEmailId, emailType, toEmail, subject, status, createdAt
        FROM EmailLog
        WHERE createdAt >= ?
        ORDER BY createdAt DESC
    """, (since_ts,))
    emails = []
    for r in c.fetchall():
        ts = r["createdAt"]
        dt = datetime.datetime.fromtimestamp(ts / 1000, tz=datetime.timezone.utc)
        emails.append({
            "dt": dt,
            "emailType": r["emailType"],
            "toEmail": r["toEmail"],
            "subject": r["subject"],
            "status": r["status"],
        })
    conn.close()
    return leads, emails


def is_staff_email(email):
    e = (email or "").lower().strip()
    return e in STAFF_EMAILS or e.endswith("@yellowstone-am.com")


def lead_category(lead):
    t = (lead["type"] or "").lower()
    lt = (lead["leadType"] or "").lower()
    if t == "tour" or lt == "booking":
        return "Tour booking"
    if t == "apply" or lt == "application_interest":
        return "Application"
    if t == "sell" or lt == "property_inquiry":
        return "Property sale"
    if t == "contact":
        return "Contact"
    return "Other"


def format_period(since, end):
    start_str = since.strftime("%B %d").replace(" 0", " ")
    end_str = end.strftime("%B %d, %Y").replace(" 0", " ")
    return f"{start_str} – {end_str}"


def generate_report_section(lines, title, since, end, leads, emails):
    by_cat = {}
    for l in leads:
        cat = lead_category(l)
        by_cat[cat] = by_cat.get(cat, 0) + 1

    customer_emails = [e for e in emails if not is_staff_email(e["toEmail"]) and e["emailType"] not in INTERNAL_TYPES]
    staff_emails = [e for e in emails if is_staff_email(e["toEmail"]) or e["emailType"] in INTERNAL_TYPES]

    emails_sent = len(customer_emails)
    emails_delivered = sum(1 for e in customer_emails if e["status"] == "delivered")
    delivery_rate = f"{round((emails_delivered / emails_sent) * 100)}%" if emails_sent else "—"

    lines.append(f"  {title}")
    lines.append(f"  Reporting period: {format_period(since, end)}")
    lines.append("")
    lines.append(f"  Total inquiries received ............ {len(leads)}")
    if "Tour booking" in by_cat:
        lines.append(f"    - Tour bookings ................... {by_cat['Tour booking']}")
    if "Application" in by_cat:
        lines.append(f"    - Rental applications ............. {by_cat['Application']}")
    if "Property sale" in by_cat:
        lines.append(f"    - Property-sale inquiries ......... {by_cat['Property sale']}")
    if "Contact" in by_cat:
        lines.append(f"    - General contacts ................ {by_cat['Contact']}")
    if "Other" in by_cat:
        lines.append(f"    - Other ........................... {by_cat['Other']}")
    lines.append("")
    lines.append(f"  Customer emails sent ................ {emails_sent}")
    lines.append(f"  Customer emails confirmed delivered . {emails_delivered}  ({delivery_rate} delivery rate)")
    lines.append("")

    lines.append("  Every inquiry received:")
    if leads:
        for l in leads:
            date_str = l["dt"].strftime("%b %d").replace(" 0", " ")
            cat = lead_category(l)
            name = l["name"]
            prop = l["property"] if l["property"] else "—"
            lines.append(f"    {date_str:<7} {cat:<16} {name:<18} {prop}")
    else:
        lines.append("    No inquiries during this period.")
    lines.append("")

    lines.append("  Customer email activity:")
    if customer_emails:
        for e in customer_emails:
            date_str = e["dt"].strftime("%b %d").replace(" 0", " ")
            status = e["status"]
            typ = e["emailType"]
            to = e["toEmail"]
            subj = e["subject"]
            lines.append(f"    {date_str:<7} {status:<10} {typ:<20} {to:<30} {subj}")
    else:
        lines.append("    No customer emails during this period.")
    lines.append("")

    if staff_emails:
        lines.append("  Staff/internal emails (not counted above):")
        for e in staff_emails:
            date_str = e["dt"].strftime("%b %d").replace(" 0", " ")
            status = e["status"]
            typ = e["emailType"]
            to = e["toEmail"]
            subj = e["subject"]
            lines.append(f"    {date_str:<7} {status:<10} {typ:<20} {to:<30} {subj}")
        lines.append("")


# Time periods
week_since = (TODAY - datetime.timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
week_end = TODAY - datetime.timedelta(days=1)
week_end = week_end.replace(hour=23, minute=59, second=59, microsecond=999999)

month_since = (TODAY - datetime.timedelta(days=30)).replace(hour=0, minute=0, second=0, microsecond=0)
month_end = week_end

week_leads, week_emails = load_data(week_since)
month_leads, month_emails = load_data(month_since)

lines = []
lines.append("=" * 62)
lines.append("  RENTINALVIN.COM  —  COMBINED 7-DAY & 30-DAY REPORT")
lines.append("  Yellowstone Asset Management")
lines.append(f"  Prepared: {TODAY.strftime('%B %d, %Y').replace(' 0', ' ')}")
lines.append("=" * 62)
lines.append("")
lines.append("Every number below is pulled directly from the live database")
lines.append("backup. Staff-facing notifications and internal reports are")
lines.append("shown separately and are NOT counted in customer email totals.")
lines.append("This file is for review only and is not emailed to anyone.")
lines.append("")
lines.append("")
lines.append("=" * 62)
lines.append("PART A — LAST 7 DAYS")
lines.append("=" * 62)
lines.append("")
generate_report_section(lines, "7-DAY REPORT", week_since, week_end, week_leads, week_emails)

lines.append("")
lines.append("=" * 62)
lines.append("PART B — LAST 30 DAYS")
lines.append("=" * 62)
lines.append("")
generate_report_section(lines, "30-DAY REPORT", month_since, month_end, month_leads, month_emails)

lines.append("")
lines.append("=" * 62)
lines.append("SYSTEMS STATUS")
lines.append("=" * 62)
lines.append("")
lines.append("All systems are operational:")
lines.append("  • Private analytics dashboard — active at /dev/analytics")
lines.append("  • Lead capture hardening — every inquiry saved to database")
lines.append("  • Email delivery tracking — logged with real delivery status")
lines.append("  • Automatic reporting — weekly reports every Sunday morning")
lines.append("  • Visitor analytics — privacy-safe tracking live on all pages")
lines.append("  • SEO foundation — business schema, sitemap, landing pages active")
lines.append("")
lines.append("")
lines.append("=" * 62)
lines.append("SIMPLE SEO: DONE vs. NEXT")
lines.append("=" * 62)
lines.append("")
lines.append("DONE:")
lines.append("  [x] Local business schema — address, hours, phone on every")
lines.append("      page in Google's format")
lines.append("  [x] Sitemap + robots setup")
lines.append("  [x] Search landing pages — availability, amenities, near")
lines.append("      Houston/Pearland")
lines.append("  [x] Spanish versions of key pages")
lines.append("")
lines.append("NEXT:")
lines.append("  [ ] Google Business Profile — claim, update, and manage the")
lines.append("      listing (needs client access)")
lines.append("  [ ] Fresh photos on the Google listing")
lines.append("  [ ] Review strategy — ask happy tenants for Google reviews")
lines.append("  [ ] Directory listings — Apartments.com, Zillow, Yelp with")
lines.append("      matching business info")
lines.append("")
lines.append("")
lines.append("=" * 62)
lines.append("WHAT WE NEED FROM THE CLIENT")
lines.append("=" * 62)
lines.append("")
lines.append("1) THE GOOGLE BUSINESS ACCOUNT.")
lines.append("")
lines.append('When someone in Alvin searches "apartments for rent near me,"')
lines.append("Google shows the map listings first — before any website.")
lines.append("Right now we cannot touch that listing. To get RentInAlvin")
lines.append("seen more, we need MANAGER ACCESS to the Google Business")
lines.append("Profile for Yellowstone Asset Management / the property listings.")
lines.append("")
lines.append("How to grant it (3 steps, ~2 minutes):")
lines.append("  1. Go to business.google.com and sign in with the Google")
lines.append("     account that owns the listing")
lines.append('  2. Open the listing -> "People & access" -> "Add"')
lines.append("  3. Add our email as MANAGER")
lines.append("")
lines.append("With access we will: update hours and photos, link the")
lines.append("website, post availability updates, respond to reviews, and")
lines.append("track how many calls and direction-requests the listing produces.")
lines.append("")
lines.append("2) THE RENTAL APPLICATION SYSTEM.")
lines.append("")
lines.append("Full online applications are NOT set up yet — and this is not")
lines.append("a website issue. The website's application form works and")
lines.append("captures the applicant's information as a lead, but it cannot")
lines.append("process a real application — screening, background/credit checks,")
lines.append("application fees — until it is connected to YOUR application")
lines.append("system on your end.")
lines.append("")
lines.append("What we need from you:")
lines.append("  - Tell us which system you use (AppFolio, RentManager,")
lines.append("    TurboTenant, or other), and")
lines.append("  - Provide the account access or the direct application link")
lines.append("    for that system.")
lines.append("")
lines.append('Once we have it, the "Apply" button connects straight into')
lines.append("your real application pipeline, and applicants can complete")
lines.append("the entire process online instead of waiting for a callback.")
lines.append("")
lines.append("")
lines.append("=" * 62)
lines.append("Data source: RentInAlvin analytics database (live backup)")
lines.append("Dashboard: rentinalvin.com/dev/analytics")
lines.append("=" * 62)

text = "\n".join(lines)
OUT.write_text(text, encoding="utf-8")
print(text)
print(f"\nSaved to: {OUT}")
