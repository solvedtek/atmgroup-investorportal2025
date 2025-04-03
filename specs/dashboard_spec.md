# Specification: Investor Portal Main Dashboard

**Version:** 1.0
**Date:** 2025-04-03

## 1. Overview

This document outlines the functional requirements, structure, and pseudocode for the main dashboard screen of the Investor Portal application. This screen is displayed after successful user login and serves as the central hub for accessing property data and performance metrics. The design is primarily influenced by the reference image `image_096b63.jpg`.

## 2. Overall Page Structure

The main dashboard page follows a standard web application layout:

```
+---------------------------------------------------+
| Header                                            |
+---------------------+-----------------------------+
| Sidebar             | Main Content Area           |
| (Navigation &       | (View changes based on      |
| Property Selection) | sidebar selection)          |
|                     |                             |
|                     |                             |
|                     |                             |
|                     |                             |
+---------------------+-----------------------------+
```

-   **Header:** Contains user-specific controls and potentially branding.
-   **Sidebar:** Provides primary navigation between different data views and allows property selection.
-   **Main Content Area:** Displays the detailed information corresponding to the selected navigation item and property.

## 3. Header Component

**Purpose:** Displays user information and provides logout functionality.

**Elements:**
-   User Profile Display/Link: Shows the logged-in user's identifier (e.g., `demo@example.com`).
    -   *TDD Anchor:* `test_header_displays_correct_user_email`
-   Logout Button/Link: Allows the user to securely end their session.
    -   *TDD Anchor:* `test_logout_button_redirects_to_login`

**Pseudocode:**

```pseudocode
MODULE HeaderComponent

  STATE:
    currentUserEmail: String // Fetched after login

  RENDER():
    DIV class="header"
      DIV class="user-profile"
        SPAN "Welcome, {currentUserEmail}"
      END DIV
      BUTTON id="logout-button" "Logout"
    END DIV

  EVENT_HANDLER onClick(logout-button):
    CALL AuthService.logout()
    REDIRECT to "/login" // Or appropriate login page route
  END EVENT_HANDLER

END MODULE
```

## 4. Sidebar Component

**Purpose:** Enables navigation between different sections (Dashboard, Reservations, etc.) and allows the user to select the property context.

**Elements:**
-   Logo/Branding: Displays the application logo (e.g., `atm_logo.svg`).
    -   *TDD Anchor:* `test_sidebar_displays_logo`
-   Property Selector: A dropdown or list allowing users to choose which property's data to view.
    -   *TDD Anchor:* `test_property_selector_populates_with_user_properties`
    -   *TDD Anchor:* `test_property_selector_updates_main_content_on_change`
-   Navigation Links: Links to switch between the main views.
    -   Dashboard
    -   Reservations
    -   Financials
    -   Reports
    -   *TDD Anchor:* `test_navigation_links_update_main_content_view`
    -   *TDD Anchor:* `test_active_navigation_link_is_highlighted`

**Pseudocode:**

```pseudocode
MODULE SidebarComponent

  STATE:
    availableProperties: List<Property> // Fetched for the current user
    selectedPropertyId: String | null
    activeView: String // e.g., "Dashboard", "Reservations"

  RENDER():
    DIV class="sidebar"
      DIV class="logo-container"
        IMG src="/assets/atm_logo.svg" alt="Logo"
      END DIV

      DIV class="property-selector-container"
        LABEL for="property-select" "Select Property:"
        SELECT id="property-select"
          FOR EACH property IN availableProperties:
            OPTION value=property.id selected=(property.id == selectedPropertyId)
              {property.name}
            END OPTION
          END FOR
        END SELECT
      END DIV

      NAV class="main-navigation"
        UL
          LI class=(activeView == "Dashboard" ? "active" : "")
            LINK to="/dashboard" "Dashboard"
          LI class=(activeView == "Reservations" ? "active" : "")
            LINK to="/reservations" "Reservations"
          LI class=(activeView == "Financials" ? "active" : "")
            LINK to="/financials" "Financials"
          LI class=(activeView == "Reports" ? "active" : "")
            LINK to="/reports" "Reports"
        END UL
      END NAV
    END DIV

  EVENT_HANDLER onChange(property-select):
    selectedPropertyId = getSelectedValue()
    // Trigger data refresh for the Main Content Area based on the new property
    EMIT event "propertyChanged" with selectedPropertyId
  END EVENT_HANDLER

  EVENT_HANDLER onClick(navigation links):
    activeView = getClickedViewName()
    // Trigger view change in Main Content Area
    EMIT event "viewChanged" with activeView
  END EVENT_HANDLER

  LIFECYCLE onMount:
    availableProperties = CALL PropertyService.getUserProperties()
    IF availableProperties is not empty AND selectedPropertyId is null THEN
      selectedPropertyId = availableProperties[0].id
      EMIT event "propertyChanged" with selectedPropertyId // Load initial data
    END IF
    // Set initial activeView based on current route or default
    activeView = getCurrentRouteView() OR "Dashboard"
    EMIT event "viewChanged" with activeView
  END LIFECYCLE

END MODULE
```

## 5. Main Content Area

**Purpose:** Displays the detailed view corresponding to the Sidebar navigation selection and chosen property. The content dynamically updates based on user interaction.

**Structure:** A container that conditionally renders one of the specific view components (Dashboard, Reservations, Financials, Reports).

**Pseudocode:**

```pseudocode
MODULE MainContentArea

  STATE:
    currentView: String // "Dashboard", "Reservations", "Financials", "Reports"
    selectedPropertyId: String | null

  LISTENERS:
    ON event "propertyChanged" from SidebarComponent:
      selectedPropertyId = event.data
      // Re-fetch data for the currentView using the new propertyId
      CALL fetchDataForView(currentView, selectedPropertyId)
    END ON

    ON event "viewChanged" from SidebarComponent:
      currentView = event.data
      // Fetch data for the new view using the current propertyId
      CALL fetchDataForView(currentView, selectedPropertyId)
    END ON

  RENDER():
    DIV class="main-content"
      IF currentView == "Dashboard" THEN
        RENDER DashboardViewComponent with propertyId=selectedPropertyId
      ELSE IF currentView == "Reservations" THEN
        RENDER ReservationsViewComponent with propertyId=selectedPropertyId
      ELSE IF currentView == "Financials" THEN
        RENDER FinancialsViewComponent with propertyId=selectedPropertyId
      ELSE IF currentView == "Reports" THEN
        RENDER ReportsViewComponent with propertyId=selectedPropertyId
      ELSE
        // Optional: Display a loading state or default message
        DIV "Loading..."
      END IF
    END DIV

  FUNCTION fetchDataForView(viewName, propertyId):
    // Placeholder for logic to fetch data specific to the view and property
    // This would likely trigger updates within the specific view components
    LOG "Fetching data for {viewName}, Property ID: {propertyId}"
    // Example: DashboardViewComponent.loadData(propertyId)
  END FUNCTION

END MODULE
```

### 5.1. Dashboard View Component

**Purpose:** Displays key performance indicators (KPIs) and performance trends for the selected property. (Ref: `image_096b63.jpg`)

**Elements:**
-   KPI Summary Cards: Displaying Occupancy Rate, ADR, Total Revenue, Net Profit.
    -   *TDD Anchor:* `test_dashboard_kpi_cards_display_correct_values`
    -   *TDD Anchor:* `test_dashboard_kpi_data_updates_on_property_change`
-   Performance Trend Graph(s): Visual representation of KPIs over time (e.g., monthly revenue trend). Specific graphs TBD.
    -   *TDD Anchor:* `test_dashboard_trend_graph_renders_data`
    -   *TDD Anchor:* `test_dashboard_trend_graph_updates_on_property_change`
-   Summary Statistics Section: Potentially other relevant summaries (e.g., upcoming bookings count, recent activity). Specifics TBD.

**Pseudocode:**

```pseudocode
MODULE DashboardViewComponent

  PROPS:
    propertyId: String | null

  STATE:
    kpiData: Object { occupancyRate, adr, totalRevenue, netProfit } | null
    trendData: Object | null // Structure depends on charting library

  LIFECYCLE onPropsChange(propertyId):
    IF propertyId is not null THEN
      CALL loadData(propertyId)
    ELSE
      // Clear data or show placeholder
      kpiData = null
      trendData = null
    END IF
  END LIFECYCLE

  FUNCTION loadData(propId):
    // Show loading indicator
    kpiData = CALL DashboardService.getKpiSummary(propId)
    trendData = CALL DashboardService.getPerformanceTrends(propId)
    // Hide loading indicator
  END FUNCTION

  RENDER():
    DIV class="dashboard-view"
      IF kpiData is null THEN
        DIV "Loading KPIs..." // Or placeholder
      ELSE
        DIV class="kpi-summary-cards"
          Card title="Occupancy Rate" value=kpiData.occupancyRate
          Card title="ADR" value=kpiData.adr
          Card title="Total Revenue" value=kpiData.totalRevenue
          Card title="Net Profit" value=kpiData.netProfit
        END DIV
      END IF

      IF trendData is null THEN
        DIV "Loading Trends..." // Or placeholder
      ELSE
        DIV class="performance-trends"
          // Placeholder for Chart Component integration
          ChartComponent type="line" data=trendData title="Revenue Trend"
        END DIV
      END IF

      // Optional: Other summary sections
    END DIV
END MODULE
```

### 5.2. Reservations View Component

**Purpose:** Displays upcoming and past reservations, typically in a calendar format. (Ref: `image_096b63.jpg`)

**Elements:**
-   Calendar Display: Visual representation of bookings over days/weeks/months.
    -   *TDD Anchor:* `test_reservations_calendar_displays_bookings`
    -   *TDD Anchor:* `test_reservations_calendar_updates_on_property_change`
-   Date Range Selector: Allows users to change the calendar view period.
-   Booking Details Popup/Panel: Shows details when a specific reservation is clicked.
    -   *TDD Anchor:* `test_clicking_reservation_shows_details`

**Pseudocode:**

```pseudocode
MODULE ReservationsViewComponent

  PROPS:
    propertyId: String | null

  STATE:
    reservations: List<Reservation> | null
    calendarViewRange: Object { start, end }
    selectedReservationDetails: Reservation | null

  LIFECYCLE onPropsChange(propertyId):
    IF propertyId is not null THEN
      CALL loadReservations(propertyId, calendarViewRange)
    ELSE
      reservations = null
    END IF
  END LIFECYCLE

  FUNCTION loadReservations(propId, dateRange):
    // Show loading indicator
    reservations = CALL ReservationService.getReservations(propId, dateRange)
    // Hide loading indicator
  END FUNCTION

  EVENT_HANDLER onDateRangeChange(newRange):
    calendarViewRange = newRange
    CALL loadReservations(propertyId, calendarViewRange)
  END EVENT_HANDLER

  EVENT_HANDLER onReservationClick(reservationId):
    selectedReservationDetails = find reservation in 'reservations' by id
    // Show details popup/panel
  END EVENT_HANDLER

  RENDER():
    DIV class="reservations-view"
      DIV class="controls"
        // Date range picker component
        DateRangePicker value=calendarViewRange onChange=onDateRangeChange
      END DIV

      IF reservations is null THEN
        DIV "Loading Reservations..."
      ELSE
        // Calendar Component integration
        CalendarComponent bookings=reservations viewRange=calendarViewRange onBookingClick=onReservationClick
      END IF

      IF selectedReservationDetails is not null THEN
        // Reservation Details Popup/Panel Component
        ReservationDetailsPopup details=selectedReservationDetails onClose=() => selectedReservationDetails = null
      END IF
    END DIV
END MODULE
```

### 5.3. Financials View Component

**Purpose:** Presents detailed financial breakdowns, including income, expenses, and profit summaries. (Ref: `image_096b63.jpg`)

**Elements:**
-   Income/Expense Table or Chart: Detailed list or visualization of revenue sources and cost categories.
    -   *TDD Anchor:* `test_financials_displays_income_expense_data`
    -   *TDD Anchor:* `test_financials_data_updates_on_property_change`
-   Profit Summary: Calculated net profit/loss for selected periods.
    -   *TDD Anchor:* `test_financials_displays_correct_profit_summary`
-   Date Range Filter: To view financial data for specific periods (e.g., month, quarter, year).
    -   *TDD Anchor:* `test_financials_date_filter_updates_data`

**Pseudocode:**

```pseudocode
MODULE FinancialsViewComponent

  PROPS:
    propertyId: String | null

  STATE:
    financialData: Object { income: List, expenses: List, summary: Object } | null
    selectedDateRange: Object { start, end } // Default to current month/year

  LIFECYCLE onPropsChange(propertyId):
    IF propertyId is not null THEN
      CALL loadFinancialData(propertyId, selectedDateRange)
    ELSE
      financialData = null
    END IF
  END LIFECYCLE

  FUNCTION loadFinancialData(propId, dateRange):
    // Show loading indicator
    financialData = CALL FinancialService.getFinancialDetails(propId, dateRange)
    // Hide loading indicator
  END FUNCTION

  EVENT_HANDLER onDateRangeChange(newRange):
    selectedDateRange = newRange
    CALL loadFinancialData(propertyId, selectedDateRange)
  END EVENT_HANDLER

  RENDER():
    DIV class="financials-view"
      DIV class="controls"
        // Date range picker component for financial period
        DateRangePicker value=selectedDateRange onChange=onDateRangeChange presets=["Month", "Quarter", "Year"]
      END DIV

      IF financialData is null THEN
        DIV "Loading Financial Data..."
      ELSE
        DIV class="financial-summary"
          // Display profit/loss summary
          SPAN "Net Profit: {financialData.summary.netProfit}" // Example
        END DIV
        DIV class="financial-details"
          // Table or Chart component for income/expenses
          FinancialDataTable income=financialData.income expenses=financialData.expenses
        END DIV
      END IF
    END DIV
END MODULE
```

### 5.4. Reports View Component

**Purpose:** Allows users to generate, view, and potentially export predefined reports. (Ref: `image_096b63.jpg`)

**Elements:**
-   Report Selection: Dropdown or list to choose the type of report (e.g., "Monthly Performance Summary", "Expense Breakdown", "Occupancy Report").
    -   *TDD Anchor:* `test_reports_list_available_report_types`
-   Report Parameters: Inputs for report-specific parameters (e.g., date range).
-   Generate Button: To create the selected report.
-   Report Display Area: Shows the generated report content (could be table, chart, or formatted text).
    -   *TDD Anchor:* `test_generating_report_displays_content`
-   Export Button (Optional): Allows downloading the report (e.g., as PDF or CSV).
    -   *TDD Anchor:* `test_export_report_button_triggers_download`

**Pseudocode:**

```pseudocode
MODULE ReportsViewComponent

  PROPS:
    propertyId: String | null

  STATE:
    availableReports: List<ReportType>
    selectedReportType: String | null
    reportParameters: Object // Dynamic based on selectedReportType
    generatedReportData: Object | null // Structure depends on report type
    isLoading: Boolean

  LIFECYCLE onMount:
    availableReports = CALL ReportService.getAvailableReportTypes()
  END LIFECYCLE

  LIFECYCLE onPropsChange(propertyId):
    // Reset state if property changes? Or allow reports across properties? TBD.
    generatedReportData = null // Clear previous report
  END LIFECYCLE

  FUNCTION generateReport():
    IF selectedReportType is not null AND propertyId is not null THEN
      isLoading = true
      generatedReportData = null
      generatedReportData = CALL ReportService.generateReport(propertyId, selectedReportType, reportParameters)
      isLoading = false
    END IF
  END FUNCTION

  EVENT_HANDLER onReportTypeChange(reportType):
    selectedReportType = reportType
    reportParameters = getDefaultParametersFor(reportType) // Reset params
    generatedReportData = null // Clear previous report
  END EVENT_HANDLER

  EVENT_HANDLER onParameterChange(paramName, value):
    reportParameters[paramName] = value
  END EVENT_HANDLER

  EVENT_HANDLER onExportClick():
     IF generatedReportData is not null THEN
        CALL ReportService.exportReport(generatedReportData, format="PDF") // Or CSV etc.
     END IF
  END EVENT_HANDLER


  RENDER():
    DIV class="reports-view"
      DIV class="report-controls"
        SELECT onChange=onReportTypeChange value=selectedReportType
          OPTION value="" "Select a Report"
          FOR EACH report IN availableReports:
            OPTION value=report.id {report.name}
          END FOR
        END SELECT

        // Dynamically render parameter inputs based on selectedReportType
        RenderParameterInputs parameters=reportParameters onChange=onParameterChange

        BUTTON onClick=generateReport disabled=(isLoading OR selectedReportType is null)
          {isLoading ? "Generating..." : "Generate Report"}
        END BUTTON
      END DIV

      DIV class="report-display-area"
        IF generatedReportData is not null THEN
          // Component to render the specific report format (table, chart, text)
          ReportDisplayComponent data=generatedReportData type=selectedReportType

          BUTTON onClick=onExportClick "Export Report" // Optional
        ELSE IF isLoading THEN
          DIV "Generating report..."
        ELSE
          DIV "Select a report type and parameters to generate."
        END IF
      END DIV
    END DIV
END MODULE
```

## 6. Data Services (Conceptual)

These modules represent the backend interaction layer.

-   **AuthService:** Handles login, logout, session management.
-   **PropertyService:** Fetches properties associated with the logged-in user.
-   **DashboardService:** Fetches KPI summaries and trend data.
-   **ReservationService:** Fetches reservation data based on property and date range.
-   **FinancialService:** Fetches detailed income, expense, and summary data.
-   **ReportService:** Fetches available report types, generates reports, handles export.

## 7. Edge Cases & Considerations

-   **No Properties:** How should the UI behave if a user has no properties assigned? (Display message, guide them).
-   **Data Loading States:** Implement clear loading indicators for all data fetching operations.
-   **Error Handling:** Display user-friendly error messages if API calls fail.
    -   *TDD Anchor:* `test_api_error_displays_user_friendly_message`
-   **Empty States:** What should be displayed in views when there is no data (e.g., no reservations in the selected period)?
-   **Responsiveness:** While not detailed here, the layout should adapt to different screen sizes.
-   **Accessibility:** Ensure components and navigation are accessible (ARIA attributes, keyboard navigation).
-   **Security:** All data fetching must be authorized based on the logged-in user and their permissions. Property access must be strictly enforced server-side.