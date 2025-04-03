# ATM Group - Investor Portal

## Description

This project is a simple, modern, mobile-friendly web portal designed for ATM Group's property investors [cite: ATM Group.png]. It provides investors, including those who may be less tech-savvy, with easy access to key performance indicators and financial data for their properties. The portal aims to enhance investor satisfaction, streamline reporting, reduce administrative overhead, and provide valuable portfolio insights. Data is sourced via integrations with QuickBooks and Guesty.

## Key Features (MVP)

* **Secure Investor Login:** Authenticated access for registered investors.
* **Demo Login:** A separate login option allowing potential investors to explore the portal interface using sample/dummy data.
* **Property Dashboard:** Displays a list of properties associated with the investor account.
* **Individual Property View:** Detailed view for each property, including:
    * **Overview Tab:** Key Performance Indicators (KPIs) like Gross Income, Total Expenses, Net Income, Occupancy Rate, ADR, Average Nights per Stay, Lead Time, etc., filterable by date range.
    * **Financial Details Tab:** Breakdown of income by source and expenses by category.
    * **Reservations/Activity Tab:** Log of recent booking activity (if applicable via Guesty data).
* **Reporting Module:** Allows users to generate and export reports for selected properties and date ranges:
    * Report Types: Financial Report, Occupancy Report, Complete Report.
    * Export Formats: PDF, Excel.
    * Inspired by provided examples [cite: image_0d1241.jpg].

## Design

* **Aesthetic:** Minimalist, modern, clean, and professional. Focus on clarity and reducing cognitive load.
* **Color Palette:** Based on the ATM Group logo [cite: ATM Group.png] and user preference for muted/pastel tones. Uses primarily:
    * Dark Grey/Charcoal (Text)
    * Off-White/Very Light Grey (Backgrounds)
    * Soft Beige/Cream/Light Muted Grey (Card/Module Backgrounds)
    * Muted Mint Green (Primary Accent)
    * *Accessibility Note: Ensure sufficient color contrast throughout.*
* **Typography:**
    * Headings: Inter
    * Body Text / Labels / Data: Nunito Sans

## Technology Stack (Planned)

* **Frontend:** React
* **Backend:** Next.js
* **Database:** Supabase
* **API Integrations:**
    * QuickBooks (for financial data)
    * Guesty (for booking/property data)
