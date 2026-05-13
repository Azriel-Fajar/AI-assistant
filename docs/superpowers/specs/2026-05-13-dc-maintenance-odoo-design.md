# dc_maintenance Odoo 17 Module -- Design Spec

**Date:** 2026-05-13
**Scope:** Proof-of-concept / demo
**Platform:** Odoo 17 (fresh install)

---

## Goal

Demonstrate a custom Odoo 17 module for data center maintenance management. Covers power infrastructure, cooling systems, and electrical assets with preventive maintenance scheduling and work order tracking.

---

## Approach

Extend Odoo's built-in `maintenance` module via Python inheritance. New module `dc_maintenance` adds data center-specific asset types, custom fields, PM scheduling, and role-based access. No replacement of core Odoo behavior.

**Depends on:** `maintenance`, `base`, `mail`

---

## Asset Categories

Three equipment categories with custom fields (2-3 per type for demo):

| Category | Custom Fields |
|---|---|
| Power Infrastructure | UPS capacity (kVA), battery last replaced, PDU load % |
| Cooling Systems | CRAC unit type, setpoint temp, last filter change |
| Electrical | Panel ID, breaker rating, last inspection date |

All extend `maintenance.equipment` via `_inherit`.

---

## Maintenance Workflows

**Preventive Maintenance**
- Default PM intervals per equipment category (e.g., UPS battery check every 90 days, CRAC filter every 60 days)
- `dc_maintenance_schedule` model tracks interval and last-done date, computes next-due
- Scheduled action (cron) runs daily, auto-creates `maintenance.request` when next_due <= today

**Corrective Maintenance**
- Manual request creation: asset, fault description, priority (low/medium/high/critical)
- Status flow: New → In Progress → Done → Closed

**Work Orders**
- Each maintenance request extended with: work order number (auto-sequence), estimated/actual duration, parts used, technician notes, fault type

---

## Data Model

### `dc_equipment` (extends `maintenance.equipment`)
```
dc_category: selection [power, cooling, electrical]
dc_location: char
dc_serial: char
dc_install_date: date
dc_warranty_expiry: date
# Power
ups_capacity_kva: float
battery_last_replaced: date
pdu_load_percent: float
# Cooling
crac_unit_type: char
setpoint_temp: float
last_filter_change: date
# Electrical
panel_id: char
breaker_rating: float
last_inspection_date: date
```

### `dc_maintenance_request` (extends `maintenance.request`)
```
dc_work_order_no: char (auto-sequence)
dc_estimated_duration: float
dc_actual_duration: float
dc_parts_used: text
dc_technician_notes: text
dc_fault_type: selection [mechanical, electrical, software, other]
```

### `dc_maintenance_schedule` (new model)
```
equipment_id: many2one → dc_equipment
interval_days: integer
last_done: date
next_due: date (computed: last_done + interval_days)
auto_create_request: boolean
```

---

## Module Structure

```
dc_maintenance/
├── __manifest__.py
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── dc_equipment.py
│   ├── dc_maintenance_request.py
│   └── dc_maintenance_schedule.py
├── views/
│   ├── dc_equipment_views.xml
│   ├── dc_maintenance_request_views.xml
│   ├── dc_dashboard_views.xml
│   └── menus.xml
├── data/
│   ├── equipment_categories.xml
│   └── pm_schedule_defaults.xml
├── security/
│   ├── ir.model.access.csv
│   └── dc_maintenance_security.xml
└── report/
    ├── maintenance_history_report.xml
    └── maintenance_history_template.xml
```

---

## Access Control

| Group | Access |
|---|---|
| `dc_maintenance.group_technician` | Create/update work orders |
| `dc_maintenance.group_manager` | Full access + assign technicians |
| `dc_maintenance.group_client` | Read-only dashboard + reports |

---

## Error Handling

- PM interval <= 0 → `ValidationError`
- Delete equipment with open requests → block with warning
- Required fields enforced in views

---

## Demo Validation Steps

1. Install module on fresh Odoo 17 instance
2. Create one asset per category (power, cooling, electrical)
3. Set PM schedule for each asset
4. Trigger cron or advance date → verify request auto-creates
5. Log in as each user group → verify access restrictions

---

## Out of Scope (demo)

- PDF/Excel report export
- Mobile-specific UI
- Multi-company support
- Automated tests
