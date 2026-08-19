/* =========================================================
   UCO BANK CAR LOAN EMI CALCULATOR
========================================================= */


/* =========================================================
   CIBIL INTEREST RATE TABLE

   Based on the image supplied by the user.
========================================================= */

const rateTable = [

    {
        min: 825,
        max: 900,
        rate: 7.45,
        name: "825 and above"
    },

    {
        min: 800,
        max: 824,
        rate: 7.65,
        name: "800 - 824"
    },

    {
        min: 750,
        max: 799,
        rate: 7.75,
        name: "750 - 799"
    },

    {
        min: 726,
        max: 749,
        rate: 8.00,
        name: "726 - 749"
    },

    {
        min: 700,
        max: 725,
        rate: 8.30,
        name: "700 - 725"
    },

    {
        min: 650,
        max: 699,
        rate: 9.05,
        name: "650 - 699"
    }

];



/* =========================================================
   GET HTML ELEMENT
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}



/* =========================================================
   FORMAT MONEY
========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(
        Math.round(amount)
    );

}



/* =========================================================
   FIND INTEREST RATE FROM CIBIL
========================================================= */

function getInterestRate(cibil) {


    /*
       According to the supplied image:
       0 / 1 or below 300 = 8.15%
    */

    if (
        cibil === 0 ||
        cibil === 1 ||
        cibil < 300
    ) {

        return {

            rate: 8.15,

            name:
                "0 / 1 or below 300"

        };

    }


    /*
       Search CIBIL table
    */

    for (
        let i = 0;
        i < rateTable.length;
        i++
    ) {

        const row =
            rateTable[i];


        if (
            cibil >= row.min &&
            cibil <= row.max
        ) {

            return {

                rate: row.rate,

                name: row.name

            };

        }

    }


    /*
       CIBIL range not specified
    */

    return null;

}



/* =========================================================
   EMPLOYMENT CATEGORY CHANGE
========================================================= */

getElement("employment")
.addEventListener(
    "change",
    updateEmploymentFields
);



function updateEmploymentFields() {


    const category =
        getElement("employment").value;


    const experience =
        getElement("experience");


    const itrGroup =
        getElement("itrGroup");


    const experienceHelp =
        getElement("experienceHelp");


    /*
       Clear existing experience options
    */

    experience.innerHTML = "";


    /*
       Default option
    */

    experience.innerHTML = `

        <option value="">

            Select Experience

        </option>

    `;



    /* =====================================================
       GOVERNMENT EMPLOYEE
    ====================================================== */

    if (
        category === "govt"
    ) {

        experience.innerHTML += `

            <option value="6">

                6 Months

            </option>


            <option value="12">

                12 Months or More

            </option>

        `;


        experienceHelp.textContent =
            "Minimum confirmed service: 6 months.";


        itrGroup.style.display =
            "none";

    }



    /* =====================================================
       NON GOVERNMENT EMPLOYEE
    ====================================================== */

    else if (
        category === "nongovt"
    ) {

        experience.innerHTML += `

            <option value="12">

                12 Months or More

            </option>

        `;


        experienceHelp.textContent =
            "Minimum confirmed service: 12 months.";


        itrGroup.style.display =
            "none";

    }



    /* =====================================================
       SELF EMPLOYED
    ====================================================== */

    else if (
        category === "self"
    ) {

        experience.innerHTML += `

            <option value="24">

                2 Years

            </option>

        `;


        experienceHelp.textContent =
            "Minimum ITR experience: 2 years.";


        itrGroup.style.display =
            "block";

    }



    /* =====================================================
       BUSINESS
    ====================================================== */

    else if (
        category === "business"
    ) {

        experience.innerHTML += `

            <option value="24">

                2 Years

            </option>

        `;


        experienceHelp.textContent =
            "Minimum ITR/business experience: 2 years.";


        itrGroup.style.display =
            "block";

    }



    /* =====================================================
       NO CATEGORY
    ====================================================== */

    else {

        experienceHelp.textContent =
            "Select employment category first.";


        itrGroup.style.display =
            "none";

    }

}



/* =========================================================
   STANDARD EMI FORMULA

   EMI = P × R × (1 + R)^N
        -------------------
          (1 + R)^N - 1

   P = Eligible Loan Amount
   R = Monthly Interest Rate
   N = Number of Months
========================================================= */

function calculateEMIAmount(
    principal,
    annualRate,
    months
) {


    /*
       Convert annual interest rate
       to monthly decimal rate.
    */

    const monthlyRate =
        annualRate / 12 / 100;


    /*
       Zero interest case
    */

    if (
        monthlyRate === 0
    ) {

        return principal / months;

    }


    /*
       EMI calculation
    */

    const factor =
        Math.pow(
            1 + monthlyRate,
            months
        );


    const emi =
        principal *
        monthlyRate *
        factor /
        (factor - 1);


    return emi;

}



/* =========================================================
   MAIN CALCULATOR
========================================================= */

function calculateEMI() {


    /* =====================================================
       GET CUSTOMER INPUTS
    ====================================================== */


    const age =
        Number(
            getElement("age").value
        );


    const cibil =
        Number(
            getElement("cibil").value
        );


    const income =
        Number(
            getElement("income").value
        );


    /*
       This is the amount requested
       by the customer.
    */

    const requiredLoanAmount =
        Number(
            getElement("loanAmount").value
        );


    const employment =
        getElement("employment").value;


    const experience =
        Number(
            getElement("experience").value
        );


    const itr =
        Number(
            getElement("itr").value
        );


    const tenure =
        Number(
            getElement("tenure").value
        );


    const vehicle =
        getElement("vehicle").value;



    /* =====================================================
       SHOW RESULT SECTION
    ====================================================== */

    getElement("resultCard")
        .style.display = "block";


    getElement("scheduleCard")
        .style.display = "none";



    /* =====================================================
       VALIDATION ERRORS
    ====================================================== */

    let errors = [];



    /* =====================================================
       AGE VALIDATION
    ====================================================== */

    if (
        !age ||
        age < 18 ||
        age > 70
    ) {

        errors.push(
            "Age should be between 18 and 70 years."
        );

    }



    /* =====================================================
       CIBIL VALIDATION
    ====================================================== */

    if (
        getElement("cibil").value === "" ||
        cibil < 0 ||
        cibil > 900
    ) {

        errors.push(
            "Please enter a valid CIBIL score."
        );

    }



    /* =====================================================
       EMPLOYMENT VALIDATION
    ====================================================== */

    if (!employment) {

        errors.push(
            "Please select employment category."
        );

    }



    /* =====================================================
       MONTHLY INCOME VALIDATION
    ====================================================== */

    if (
        (
            employment === "govt" ||
            employment === "nongovt"
        ) &&
        income < 20000
    ) {

        errors.push(
            "Minimum monthly income for salaried categories is ₹20,000."
        );

    }



    /* =====================================================
       GOVERNMENT EMPLOYEE
    ====================================================== */

    if (
        employment === "govt"
    ) {

        if (
            experience < 6
        ) {

            errors.push(
                "Government employee requires minimum 6 months confirmed service."
            );

        }

    }



    /* =====================================================
       NON GOVERNMENT EMPLOYEE
    ====================================================== */

    if (
        employment === "nongovt"
    ) {

        if (
            experience < 12
        ) {

            errors.push(
                "Non-Government employee requires minimum 12 months confirmed service."
            );

        }

    }



    /* =====================================================
       SELF EMPLOYED / BUSINESS
    ====================================================== */

    if (
        employment === "self" ||
        employment === "business"
    ) {


        /*
           ITR validation
        */

        if (
            itr < 24
        ) {

            errors.push(
                "Self-employed / Business category requires 2 years ITR."
            );

        }


        /*
           Minimum amount from
           supplied image.
        */

        if (
            requiredLoanAmount < 500000
        ) {

            errors.push(
                "Minimum loan amount shown for this category is ₹5 lakh."
            );

        }

    }



    /* =====================================================
       REQUIRED LOAN AMOUNT
    ====================================================== */

    if (
        !requiredLoanAmount ||
        requiredLoanAmount <= 0
    ) {

        errors.push(
            "Please enter a valid required loan amount."
        );

    }



    /* =====================================================
       CIBIL INTEREST RATE
    ====================================================== */

    const rateInformation =
        getInterestRate(cibil);


    if (
        !rateInformation
    ) {

        errors.push(
            "No interest rate is specified in the supplied product information for this CIBIL range."
        );

    }



    /* =====================================================
       DISPLAY VALIDATION ERRORS
    ====================================================== */

    if (
        errors.length > 0
    ) {

        showError(
            errors,
            requiredLoanAmount
        );

        return;

    }



    /* =====================================================
       80% ELIGIBILITY CALCULATION
    ====================================================== */

    /*
       Customer's requested amount
       is NOT directly used for EMI.

       Only 80% is considered
       as eligible loan amount.
    */

    const eligibleLoanAmount =
        requiredLoanAmount * 0.80;



    /* =====================================================
       INTEREST RATE
    ====================================================== */

    let annualRate =
        rateInformation.rate;



    /* =====================================================
       ELECTRIC VEHICLE CONCESSION
    ====================================================== */

    if (
        vehicle === "ev"
    ) {

        annualRate =
            annualRate - 0.10;

    }



    /* =====================================================
       EMI CALCULATION
    ====================================================== */

    /*
       IMPORTANT:

       EMI is calculated using
       the 80% eligible amount.
    */

    const emi =
        calculateEMIAmount(
            eligibleLoanAmount,
            annualRate,
            tenure
        );



    /* =====================================================
       TOTAL REPAYMENT
    ====================================================== */

    const totalPayment =
        emi * tenure;



    /* =====================================================
       TOTAL INTEREST
    ====================================================== */

    const totalInterest =
        totalPayment -
        eligibleLoanAmount;



    /* =====================================================
       DISPLAY AMOUNT BREAKDOWN
    ====================================================== */

    getElement("requiredAmount")
        .textContent =
        formatCurrency(
            requiredLoanAmount
        );


    getElement("eligibleAmount")
        .textContent =
        formatCurrency(
            eligibleLoanAmount
        );



    /* =====================================================
       DISPLAY EMI RESULTS
    ====================================================== */

    getElement("interestRate")
        .textContent =
        annualRate.toFixed(2) + "%";


    getElement("monthlyEMI")
        .textContent =
        formatCurrency(
            emi
        );


    getElement("totalInterest")
        .textContent =
        formatCurrency(
            totalInterest
        );


    getElement("totalPayment")
        .textContent =
        formatCurrency(
            totalPayment
        );



    /* =====================================================
       ELIGIBILITY SUCCESS
    ====================================================== */

    getElement("eligibilityStatus")
        .innerHTML = `

        <div class="status status-success">

            <strong>
                Preliminary eligibility criteria satisfied
            </strong>

            <br>

            The EMI has been calculated on
            <strong>80% of the required loan amount.</strong>

        </div>

    `;



    /* =====================================================
       RESULT DETAILS
    ====================================================== */

    getElement("resultDetails")
        .innerHTML = `

        <strong>
            CIBIL Band:
        </strong>

        ${rateInformation.name}

        <br>


        <strong>
            Required Loan Amount:
        </strong>

        ${formatCurrency(
            requiredLoanAmount
        )}

        <br>


        <strong>
            Eligible Loan Amount (80%):
        </strong>

        ${formatCurrency(
            eligibleLoanAmount
        )}

        <br>


        <strong>
            Tenure:
        </strong>

        ${tenure} Months

        <br>


        <strong>
            Applicable Interest Rate:
        </strong>

        ${annualRate.toFixed(2)}%

        <br>


        ${
            vehicle === "ev"
            ?
            `
            <strong>
                EV Concession:
            </strong>

            0.10% applied

            <br>
            `
            :
            ""
        }


        <em>

            EMI is calculated using the
            standard reducing-balance EMI formula.

            This calculation is indicative only and does not
            constitute a loan sanction or commitment.

        </em>

    `;



    /* =====================================================
       CREATE AMORTIZATION SCHEDULE
    ====================================================== */

    createSchedule(
        eligibleLoanAmount,
        annualRate,
        tenure,
        emi
    );



    /* =====================================================
       SHOW SCHEDULE
    ====================================================== */

    getElement("scheduleCard")
        .style.display = "block";



    /* =====================================================
       SCROLL TO RESULT
    ====================================================== */

    getElement("resultCard")
        .scrollIntoView({
            behavior: "smooth"
        });

}



/* =========================================================
   SHOW ERROR
========================================================= */

function showError(
    errors,
    requiredLoanAmount
) {


    /*
       If amount was entered,
       show its 80% value even when
       other eligibility criteria fail.
    */

    if (
        requiredLoanAmount &&
        requiredLoanAmount > 0
    ) {

        const eligibleAmount =
            requiredLoanAmount * 0.80;


        getElement("requiredAmount")
            .textContent =
            formatCurrency(
                requiredLoanAmount
            );


        getElement("eligibleAmount")
            .textContent =
            formatCurrency(
                eligibleAmount
            );

    }


    /*
       Error message
    */

    getElement("eligibilityStatus")
        .innerHTML = `

        <div class="status status-error">

            <strong>
                Preliminary eligibility criteria not satisfied
            </strong>

            <br><br>

            ${errors
                .map(
                    error =>
                    "• " + error
                )
                .join("<br>")
            }

        </div>

    `;


    /*
       Clear EMI
    */

    getElement("interestRate")
        .textContent = "—";


    getElement("monthlyEMI")
        .textContent = "—";


    getElement("totalInterest")
        .textContent = "—";


    getElement("totalPayment")
        .textContent = "—";


    getElement("resultDetails")
        .innerHTML = "";

}



/* =========================================================
   AMORTIZATION SCHEDULE
========================================================= */

function createSchedule(
    principal,
    annualRate,
    months,
    emi
) {


    /*
       Monthly interest rate
    */

    const monthlyRate =
        annualRate / 12 / 100;


    /*
       Starting balance
    */

    let balance =
        principal;


    /*
       Table HTML
    */

    let html = "";



    /*
       Loop through every month
    */

    for (
        let month = 1;
        month <= months;
        month++
    ) {


        /*
           Opening balance
        */

        const openingBalance =
            balance;


        /*
           Interest component
        */

        const interest =
            balance *
            monthlyRate;


        /*
           Principal component
        */

        let principalComponent =
            emi - interest;


        /*
           Normal EMI
        */

        let actualEMI =
            emi;


        /*
           Last month correction
        */

        if (
            month === months
        ) {

            principalComponent =
                balance;


            actualEMI =
                principalComponent +
                interest;

        }


        /*
           Closing balance
        */

        balance =
            balance -
            principalComponent;


        if (
            balance < 0
        ) {

            balance = 0;

        }



        /*
           Create row
        */

        html += `

            <tr>

                <td>
                    ${month}
                </td>


                <td>
                    ${formatCurrency(
                        openingBalance
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        actualEMI
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        principalComponent
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        interest
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        balance
                    )}
                </td>

            </tr>

        `;

    }


    /*
       Insert table
    */

    getElement("scheduleBody")
        .innerHTML = html;

}



/* =========================================================
   RESET CALCULATOR
========================================================= */

function resetCalculator() {


    /*
       Clear inputs
    */

    getElement("age").value = "";

    getElement("cibil").value = "";

    getElement("income").value = "";

    getElement("loanAmount").value = "";


    getElement("employment").value = "";


    getElement("experience").innerHTML = `

        <option value="">

            Select Employment Category First

        </option>

    `;


    getElement("itr").value = "";


    getElement("vehicle").value =
        "normal";


    /*
       Hide ITR
    */

    getElement("itrGroup")
        .style.display = "none";


    /*
       Hide result
    */

    getElement("resultCard")
        .style.display = "none";


    /*
       Hide schedule
    */

    getElement("scheduleCard")
        .style.display = "none";


    /*
       Clear schedule
    */

    getElement("scheduleBody")
        .innerHTML = "";

}