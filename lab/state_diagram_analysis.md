# State Diagram Analysis — JTJ &amp; SONIQUE

---

## 1. JTJ — State Diagram Analysis

### 1.1 Booking Lifecycle (8 states)

```
[●] → ENQUIRY → PENDING ESTIMATE → BOOKED → IN PROGRESS → AWAITING SIGNATURE → COMPLETED → INVOICED → PAID → [◉]
                        ↘ CANCELLED → [◉]
                                    BOOKED ↘ CANCELLED → [◉]
                        IN PROGRESS ↺ (self-loop for REGULAR weekly cleaning)
```

| State              | Entry/Do Actions                                    | Transitions Out                               |
|--------------------|-----------------------------------------------------|------------------------------------------------|
| **ENQUIRY**         | Log enquiry, book appointment for office manager    | → PENDING ESTIMATE (appointmentBooked)         |
| **PENDING ESTIMATE**| Office manager visits property, negotiates price    | → BOOKED (termsAgreed) / → CANCELLED (rejected)|
| **BOOKED**          | Create 3 booking form copies, assign cleaners       | → IN PROGRESS (date reached) / → CANCELLED     |
| **IN PROGRESS**     | Cleaners perform work, record hours                 | → AWAITING SIGNATURE (complete) / ↺ self (regular) |
| **AWAITING SIGNATURE**| Customer reviews work, signs booking form         | → COMPLETED (formSigned)                       |
| **COMPLETED**       | Update status, return signed form to office         | → INVOICED (invoiceGenerated)                  |
| **INVOICED**        | Generate + send invoice (immediate or monthly)      | → PAID (paymentReceived)                       |
| **PAID**            | Record payment, issue receipted invoice             | → [Final] (archived)                           |
| **CANCELLED**       | Record cancellation reason                          | → [Final]                                     |

**Key Analysis:**

1. **Self-loop on IN PROGRESS** — This is unique to regular bookings. Each week, the booking loops back to IN PROGRESS (cleaners dispatched again) without progressing. It only exits when the regular contract ends or is cancelled.

2. **Guard condition on invoice timing** — The COMPLETED → INVOICED transition has a critical guard: `[ONE-OFF: immediate]` vs `[REGULAR: month-end]`. This means the same state machine has **time-based branching**, which any computer system must handle with scheduled jobs or timers.

3. **Two cancellation entry points** — Cancellation can happen from PENDING ESTIMATE (customer rejects price) or from BOOKED (customer changes mind). It **cannot** occur from IN PROGRESS or later, because cleaners are already on-site.

4. **Linear happy path** — The main flow is a strict linear sequence of 8 states, making it predictable but also meaning that any blockage (e.g., unsigned form, delayed payment) stalls the entire booking progression.

---

### 1.2 Invoice Lifecycle (5 states)

```
[●] → GENERATING → SENT (UNPAID) → PAID → [◉]
                          ↘ OVERDUE → PAID → [◉]
```

| State            | Actions                                              | Key Transitions                                |
|------------------|------------------------------------------------------|------------------------------------------------|
| **GENERATING**    | Calculate totals, populate line items                | → SENT (invoicePrinted)                        |
| **SENT (UNPAID)** | Print, post to customer, await payment              | → PAID / → OVERDUE [> 30 days]                 |
| **OVERDUE**       | Flag for follow-up, send reminders                   | → PAID (paymentReceived)                       |
| **PAID**          | Record payment, issue receipt                        | → [Final]                                     |

**Key Analysis:**

- **OVERDUE is a time-triggered state** — It fires automatically after 30 days without payment. This requires a **timer transition** in the implementation, which is a common pattern for financial systems.
- **Both SENT and OVERDUE converge to PAID** — regardless of how long it takes, all invoices eventually reach PAID (in the happy path). Bad debt handling is outside the current scope.
- **Regular vs one-off difference** is in GENERATING state, where regular invoices consolidate multiple properties per customer.

---

### 1.3 BookingForm Lifecycle (6 states)

```
[●] → CREATED → DISTRIBUTED → WITH CLEANERS → SIGNED → RETURNED TO OFFICE → [◉]
```

| State              | purpose                                              |
|--------------------|------------------------------------------------------|
| **CREATED**         | 3 copies generated at time of booking                |
| **DISTRIBUTED**     | 1 copy to customer, 2 copies filed at office         |
| **WITH CLEANERS**   | Office copy given to cleaners for the job            |
| **SIGNED**          | Customer signs confirming satisfactory work          |
| **RETURNED TO OFFICE** | Cleaners bring signed copy back to office         |

**Key Analysis:**

- This is a **purely linear state machine** with no branches, loops, or error states. This reflects the simple physical lifecycle of a paper document.
- The critical transition is **WITH CLEANERS → SIGNED** — this is the customer satisfaction checkpoint. Without the signature, the booking cannot progress to INVOICED.
- Each copy of the form has its own lifecycle — the customer copy stays with the customer permanently, while the two office copies have different journeys (one gets signed).

---

## 2. SONIQUE — State Diagram Analysis

### 2.1 Audio Recording &amp; Classification Pipeline (9 states)

```
[●] → IDLE → REQUESTING PERMISSIONS → RECORDING → UPLOADING → CONVERTING → CLASSIFYING → STORING → DISPLAYING RESULT → IDLE (cycle)
                    ↘ ERROR → IDLE (retry)                ↘ ERROR (upload fail)
                                                                              DISPLAYING → [◉] (session ends)
```

| State                    | Entry/Do Actions                                        | Transitions Out                              |
|--------------------------|--------------------------------------------------------|----------------------------------------------|
| **IDLE**                  | Display record button, show previous markers           | → REQUESTING PERMISSIONS (button pressed)    |
| **REQUESTING PERMISSIONS**| Request mic + geolocation access                       | → RECORDING (granted) / → ERROR (denied)    |
| **RECORDING**             | Start MediaRecorder, display waveform, capture GPS     | → UPLOADING (stop pressed)                   |
| **UPLOADING**             | Create FormData, POST to /upload, show spinner         | → CONVERTING (success) / → ERROR (fail)     |
| **CONVERTING**            | Receive WebM, convert to WAV 16kHz mono                | → CLASSIFYING (conversion done)              |
| **CLASSIFYING**           | Load YAMNet, run inference, extract top-3              | → STORING (classification done)              |
| **STORING**               | INSERT into SQLite (label, confidence, lat, lon)       | → DISPLAYING (saved)                         |
| **DISPLAYING RESULT**     | Show results, place marker, update heatmap             | → IDLE (new recording) / → [Final] (ends)   |
| **ERROR**                 | Display error message, log to console                  | → IDLE (retry/dismiss)                       |

**Key Analysis:**

1. **Pipeline pattern** — States are arranged as a strictly ordered processing pipeline: capture → transport → transform → classify → persist → display. This is a classic **Pipe-and-Filter** architectural pattern reflected in the state machine.

2. **Two error paths** — Errors can occur at:
   - REQUESTING PERMISSIONS → ERROR (user denies mic/GPS)
   - UPLOADING → ERROR (network failure or server error)
   
   Both recover to IDLE, enabling retry. No error states exist for CONVERTING, CLASSIFYING, or STORING because these are local server operations that should not fail under normal conditions.

3. **Cyclic behaviour** — The DISPLAYING RESULT → IDLE transition creates a cycle, allowing users to record multiple sounds in a session. This differentiates it from JTJ's linear booking lifecycle.

4. **No concurrent states** — Recording and GPS acquisition occur simultaneously in practice (parallel activities within RECORDING state), but the state machine abstracts this as a single state. A more detailed model could use a **concurrent state** (orthogonal regions) to show audio capture and GPS acquisition running in parallel.

5. **Frontend/Backend boundary** — States IDLE, REQUESTING PERMISSIONS, RECORDING, and DISPLAYING RESULT execute on the **frontend**. States UPLOADING creates the boundary crossing. CONVERTING, CLASSIFYING, and STORING execute on the **backend**. This division maps directly to the client-server architecture.

---

### 2.2 Map View Component (5 states)

```
[●] → LOADING MAP → MARKERS VIEW ↔ HEATMAP VIEW
                    MARKERS VIEW → POPUP OPEN → MARKERS VIEW
                    MARKERS VIEW → UPDATING → MARKERS VIEW
```

| State           | Key Behaviour                                         |
|-----------------|-------------------------------------------------------|
| **LOADING MAP**  | Fetch OSM tiles, initialize Leaflet                   |
| **MARKERS VIEW** | Default view, colour-coded markers with click events  |
| **HEATMAP VIEW** | Overlay showing sound density, markers hidden         |
| **POPUP OPEN**   | Marker detail popup showing label, confidence, date   |
| **UPDATING**     | New classification result received, map refreshes     |

**Key Analysis:**

- **Toggle pattern** between MARKERS VIEW and HEATMAP VIEW — these are mutually exclusive display modes, a classic **state toggle** pattern.
- **POPUP OPEN is a sub-state** of MARKERS VIEW — it can only be reached from MARKERS VIEW and always returns there, making it a natural candidate for a **nested state**.
- **UPDATING acts as a transient state** — it processes the new data and immediately returns to the previous view. In implementation, this is likely handled by a React `useEffect` hook rather than an explicit state.

---

## 3. Comparative Analysis

| Aspect                    | JTJ                                          | SONIQUE                                      |
|---------------------------|-----------------------------------------------|----------------------------------------------|
| **Total States**          | 19 (across 3 diagrams)                        | 14 (across 2 diagrams)                       |
| **State Machine Count**  | 3 (Booking, Invoice, BookingForm)              | 2 (Pipeline, MapView)                        |
| **Dominant Pattern**      | Linear lifecycle with branching               | Cyclic pipeline                              |
| **Self-loops**            | Yes (regular weekly cleaning)                 | No                                           |
| **Error States**          | CANCELLED, OVERDUE                            | ERROR (with recovery)                        |
| **Time-triggered**        | Yes (monthly invoice, 30-day overdue)         | No (all user/event triggered)                |
| **Guard Conditions**      | [ONE-OFF vs REGULAR], [> 30 days]             | [permissionsGranted vs denied]               |
| **Concurrent States**     | None                                          | Possible in RECORDING (audio + GPS)          |
| **State Complexity**      | Medium-High (business rules, timing)          | Medium (processing pipeline)                 |

### Key Differences

1. **JTJ has time-dependent transitions** (30-day overdue, end-of-month invoicing) that require scheduled processes. SONIQUE is entirely event-driven.
2. **JTJ's Booking state machine is the most complex** with 8 states, 2 cancellation paths, and a self-loop for regular jobs. It models a long-running business process that can span weeks.
3. **SONIQUE's pipeline is inherently cyclic** — each recording creates a new cycle through the same states. JTJ's booking lifecycle is one-shot (each booking traverses the states exactly once).
4. **Error recovery differs** — JTJ's CANCELLED state is terminal (no recovery), while SONIQUE's ERROR state always returns to IDLE for retry, reflecting the expectation that software errors are recoverable but business cancellations are not.
