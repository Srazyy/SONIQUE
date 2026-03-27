# Just The Job (JTJ) — Pseudo Code: Generate Invoice (Process 7.0)

This is a primitive process from the Level-1 DFD — **"Generate Invoice"**.
It handles both one-off invoices (sent immediately after signed booking form is returned) and monthly invoices for regular customers. Regular customers with multiple properties receive a single consolidated invoice.

---

## Pseudo Code

```
PROCESS GenerateInvoice (jobDetails, customerNumber, jobType)

BEGIN
    // ── Step 1: Retrieve customer details ──
    customer ← LOOKUP customerNumber IN CustomerFile
    IF customer NOT FOUND THEN
        RETURN Error("Customer not found")
    END IF

    // ── Step 2: Determine invoice type ──
    IF jobType = "ONE-OFF" THEN

        // ── One-off Invoice: Send immediately ──
        invoiceTotal ← jobDetails.agreedPrice
        
        invoice ← CREATE NEW Invoice
        invoice.invoiceNumber   ← GENERATE next invoice number
        invoice.customerNumber  ← customerNumber
        invoice.customerName    ← customer.name
        invoice.customerAddress ← customer.address
        invoice.date            ← CURRENT_DATE()
        invoice.lineItems       ← [
            {
                description : jobDetails.propertyAddress + " — One-off Clean",
                date        : jobDetails.cleaningDate,
                amount      : invoiceTotal
            }
        ]
        invoice.totalAmount     ← invoiceTotal
        invoice.status          ← "UNPAID"

    ELSE IF jobType = "REGULAR" THEN

        // ── Monthly Invoice: Consolidate all properties ──
        regularJobs ← FIND ALL jobs IN BookingFile
                       WHERE customerNumber = customerNumber
                       AND   type = "REGULAR"
                       AND   month = CURRENT_MONTH()
                       AND   invoiced = FALSE

        IF regularJobs IS EMPTY THEN
            RETURN  // Nothing to invoice this month
        END IF

        lineItems ← EMPTY LIST
        invoiceTotal ← 0

        FOR EACH job IN regularJobs DO
            weeksWorked ← COUNT weeks in CURRENT_MONTH where job was done
            lineAmount  ← job.hourlyRate × job.hoursPerVisit × weeksWorked

            APPEND {
                description : job.propertyAddress + " — Weekly Clean",
                hours       : job.hoursPerVisit × weeksWorked,
                rate        : job.hourlyRate,
                amount      : lineAmount
            } TO lineItems

            invoiceTotal ← invoiceTotal + lineAmount
            MARK job AS invoiced = TRUE
        END FOR

        invoice ← CREATE NEW Invoice
        invoice.invoiceNumber   ← GENERATE next invoice number
        invoice.customerNumber  ← customerNumber
        invoice.customerName    ← customer.name
        invoice.customerAddress ← customer.address
        invoice.date            ← LAST_DAY_OF(CURRENT_MONTH())
        invoice.lineItems       ← lineItems
        invoice.totalAmount     ← invoiceTotal
        invoice.status          ← "UNPAID"

    END IF

    // ── Step 3: Store invoice ──
    SAVE invoice TO InvoiceFile

    // ── Step 4: Print and send ──
    PRINT invoice
    SEND invoice TO customer.address

    RETURN invoice
END
```

---

## Key Characteristics

| Property            | Value                                                  |
|---------------------|--------------------------------------------------------|
| **Process ID**      | 7.0                                                    |
| **Type**            | Primitive Process                                       |
| **Input**           | Verified job details, customer number, job type         |
| **Output**          | Printed invoice sent to customer                        |
| **One-off Rule**    | Invoice sent immediately when signed form is returned   |
| **Regular Rule**    | Monthly invoice — consolidates all properties per customer |
| **Data Stores**     | Reads: D1 (Customer File), D2 (Booking/Job File); Writes: D4 (Invoice File) |
