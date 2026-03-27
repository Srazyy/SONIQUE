# Just The Job (JTJ) — Data Elements for Data Flows

This document lists the data elements that compose each major data flow in the JTJ Level-1 DFD.

---

## 1. Booking Request (Customer → Process 1.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| customer_name        | Name of the customer                           |
| contact_number       | Customer's telephone number                    |
| property_address     | Address of property to be cleaned              |
| job_type             | One-off or Regular                             |
| preferred_date       | Customer's preferred date for visit/cleaning   |

---

## 2. Appointment Details (Process 1.0 → Process 2.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| appointment_date     | Date of office manager visit                   |
| appointment_time     | Time of visit                                  |
| customer_name        | Name of customer                               |
| property_address     | Address to visit                               |
| contact_number       | Customer phone number                          |

---

## 3. Estimate — Date & Price (Process 2.0 → Office Manager / Process 3.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| property_address     | Address of property inspected                  |
| agreed_date          | Agreed date for cleaning                       |
| agreed_price         | Quoted price for one-off job (£)               |
| hourly_rate          | Negotiated hourly rate (for regular jobs, £/hr)|
| cleaning_day         | Agreed day of week (regular jobs only)         |
| estimated_hours      | Estimated hours per visit                      |

---

## 4. Booking Form — Customer Copy (Process 3.0 → Customer)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| booking_number       | Unique booking reference                       |
| customer_name        | Customer's name                                |
| property_address     | Property to clean                              |
| agreed_date          | Cleaning date (one-off) or start date (regular)|
| agreed_price         | Total price (one-off) or hourly rate (regular) |
| job_type             | One-off / Regular                              |

---

## 5. Booking Record (Process 3.0 → D2 Booking/Job File)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| booking_number       | Unique booking reference                       |
| customer_number      | Link to Customer File                          |
| property_address     | Property address                               |
| job_type             | One-off / Regular                              |
| agreed_date          | Date of cleaning                               |
| agreed_price         | Price or hourly rate                           |
| status               | Booked / Completed / Invoiced / Paid           |

---

## 6. Customer Details (Process 3.0 → D1 Customer File)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| customer_number      | Auto-allocated unique customer ID              |
| customer_name        | Full name                                      |
| address              | Postal address                                 |
| contact_number       | Telephone number                               |
| job_type             | One-off / Regular / Both                       |
| date_registered      | Date customer was first added                  |

---

## 7. Job Details (Process 3.0 → Process 4.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| booking_number       | Booking reference                              |
| property_address     | Location of cleaning job                       |
| cleaning_date        | Scheduled date                                 |
| estimated_hours      | Hours expected                                 |
| job_type             | One-off / Regular                              |

---

## 8. Weekly Schedule & Booking Form (Process 4.0 → Cleaners)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| cleaner_name         | Name of assigned cleaner                       |
| week_commencing      | Start date of the week                         |
| day                  | Day of the week                                |
| time                 | Start time                                     |
| property_address     | Address to clean                               |
| customer_name        | Customer name for the job                      |
| booking_form_copy    | Copy of booking form for customer to sign      |

---

## 9. Cleaner Assignment (Process 4.0 → D3 Cleaner File)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| cleaner_id           | Unique cleaner identifier                      |
| cleaner_name         | Cleaner's full name                            |
| booking_number       | Job assigned                                   |
| assigned_date        | Date of assignment                             |

---

## 10. Signed Booking Form (Process 5.0 → Process 6.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| booking_number       | Booking reference                              |
| customer_signature   | Customer's signature confirming satisfaction    |
| completion_date      | Date job was completed                         |

---

## 11. Hours Worked (Process 5.0 → Process 9.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| cleaner_id           | Cleaner identifier                             |
| booking_number       | Job reference                                  |
| hours_worked         | Number of hours worked on this job             |
| date_worked          | Date the hours were worked                     |

---

## 12. Verified Job Details (Process 6.0 → Process 7.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| booking_number       | Booking reference                              |
| customer_number      | Customer identifier                            |
| property_address     | Property cleaned                               |
| agreed_price         | Price (one-off) or hourly rate (regular)       |
| total_hours          | Total hours worked (regular jobs)              |
| job_type             | One-off / Regular                              |
| completion_date      | When job was completed                         |

---

## 13. Invoice (Process 7.0 → Customer)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| invoice_number       | Unique invoice reference                       |
| customer_name        | Customer name                                  |
| customer_address     | Customer postal address                        |
| invoice_date         | Date invoice was generated                     |
| line_items           | List of job descriptions with amounts          |
| total_amount         | Total amount due (£)                           |

---

## 14. Payment (Customer → Process 8.0)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| invoice_number       | Invoice being paid                             |
| payment_amount       | Amount paid (£)                                |
| payment_date         | Date payment was received                      |
| payment_method       | Cash / Cheque / Bank Transfer                  |

---

## 15. Receipted Invoice (Process 8.0 → Customer)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| invoice_number       | Original invoice reference                     |
| receipt_date         | Date receipt was issued                        |
| amount_paid          | Confirmed payment amount (£)                   |
| status               | PAID                                           |

---

## 16. Weekly Hours (Process 9.0 → D3 Cleaner File)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| cleaner_id           | Cleaner identifier                             |
| week_commencing      | Week start date                                |
| total_hours          | Total hours worked that week                   |

---

## 17. Weekly Hours List (Process 9.0 → Office Manager)

| Data Element         | Description                                    |
|----------------------|------------------------------------------------|
| week_commencing      | Week start date                                |
| cleaner_name         | Name of cleaner                                |
| total_hours          | Hours worked that week                         |
| jobs_completed       | Number of jobs done                            |
