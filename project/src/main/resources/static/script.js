const API_BASE_URL = "http://localhost:8080";


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    setCurrentDate();

    loadDashboardData();

    loadDoctors();

    loadPatients();

    showDashboard();

});


// =====================================================
// CURRENT DATE
// =====================================================

function setCurrentDate() {

    const dateElement =
        document.getElementById("currentDate");


    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showDashboard() {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(
        function (section) {

            section.classList.add(
                "hidden"
            );

        }
    );


    const dashboard =
        document.getElementById(
            "dashboardSection"
        );


    if (dashboard) {

        dashboard.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function (item) {

            item.classList.remove(
                "active"
            );

        }
    );


    const dashboardButton =
        document.querySelector(
            ".nav-item[onclick='showDashboard()']"
        );


    if (dashboardButton) {

        dashboardButton.classList.add(
            "active"
        );

    }


    updatePageTitle(
        "dashboard"
    );

}


// =====================================================
// SHOW OTHER SECTIONS
// =====================================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(
        function (section) {

            section.classList.add(
                "hidden"
            );

        }
    );


    const dashboard =
        document.getElementById(
            "dashboardSection"
        );


    if (dashboard) {

        dashboard.classList.add(
            "hidden"
        );

    }


    const selectedSection =
        document.getElementById(
            sectionId
        );


    if (selectedSection) {

        selectedSection.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function (item) {

            item.classList.remove(
                "active"
            );

        }
    );


    navItems.forEach(
        function (item) {

            const onclickValue =
                item.getAttribute(
                    "onclick"
                );


            if (
                onclickValue &&
                onclickValue.includes(
                    sectionId
                )
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    updatePageTitle(
        sectionId
    );


    if (
        sectionId ===
        "doctorsSection"
    ) {

        loadDoctors();

    }


    if (
        sectionId ===
        "patientsSection"
    ) {

        loadPatients();

    }


    if (
        sectionId ===
        "tokenSection"
    ) {

        loadDoctors();

        loadPatients();

    }


    if (
        sectionId ===
        "queueSection"
    ) {

        loadDoctors();

    }


    if (
        sectionId ===
        "historySection"
    ) {

        loadDoctors();

    }

}


// =====================================================
// UPDATE PAGE TITLE
// =====================================================

function updatePageTitle(sectionId) {

    const title =
        document.getElementById(
            "pageTitle"
        );


    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );


    const pageInfo = {

        dashboard: {

            title:
                "Dashboard",

            subtitle:
                "Welcome back! Here's today's OPD overview."

        },


        doctorsSection: {

            title:
                "Doctors",

            subtitle:
                "View and manage registered doctors."

        },


        patientsSection: {

            title:
                "Patients",

            subtitle:
                "View and manage registered patients."

        },


        tokenSection: {

            title:
                "Generate Token",

            subtitle:
                "Create a new OPD token for a patient."

        },


        queueSection: {

            title:
                "Live Queue",

            subtitle:
                "Monitor and manage the current OPD queue."

        },


        historySection: {

            title:
                "Token History",

            subtitle:
                "View today's OPD token activity."

        }

    };


    const info =
        pageInfo[sectionId] ||
        pageInfo.dashboard;


    if (title) {

        title.textContent =
            info.title;

    }


    if (subtitle) {

        subtitle.textContent =
            info.subtitle;

    }

}


// =====================================================
// DASHBOARD DATA
// =====================================================

async function loadDashboardData() {

    try {


        // ---------------------------------------------
        // LOAD DOCTORS
        // ---------------------------------------------

        const doctorResponse =
            await fetch(
                `${API_BASE_URL}/api/doctors`
            );


        if (!doctorResponse.ok) {

            throw new Error(
                "Unable to load doctors"
            );

        }


        const doctors =
            await doctorResponse.json();


        const doctorCount =
            document.getElementById(
                "doctorCount"
            );


        if (doctorCount) {

            doctorCount.textContent =
                doctors.length;

        }



        // ---------------------------------------------
        // LOAD PATIENTS
        // ---------------------------------------------

        const patientResponse =
            await fetch(
                `${API_BASE_URL}/api/patients`
            );


        if (!patientResponse.ok) {

            throw new Error(
                "Unable to load patients"
            );

        }


        const patients =
            await patientResponse.json();


        const patientCount =
            document.getElementById(
                "patientCount"
            );


        if (patientCount) {

            patientCount.textContent =
                patients.length;

        }



        // ---------------------------------------------
        // LOAD QUEUE INFORMATION
        // ---------------------------------------------

        if (doctors.length > 0) {


            const doctorId =
                doctors[0].doctorId;


            const queueResponse =
                await fetch(
                    `${API_BASE_URL}/api/tokens/doctors/${doctorId}/queue`
                );


            const queue =
                await queueResponse.json();


            const waitingCount =
                document.getElementById(
                    "waitingCount"
                );


            if (waitingCount) {

                waitingCount.textContent =
                    queue.length;

            }



            // -----------------------------------------
            // LOAD TODAY'S HISTORY
            // -----------------------------------------

            const historyResponse =
                await fetch(
                    `${API_BASE_URL}/api/tokens/doctors/${doctorId}/history`
                );


            const history =
                await historyResponse.json();


            const servingTokens =
                history.filter(
                    function (token) {

                        return (
                            token.status ===
                            "SERVING"
                        );

                    }
                );


            const servingCount =
                document.getElementById(
                    "servingCount"
                );


            if (servingCount) {

                servingCount.textContent =
                    servingTokens.length;

            }

        }


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// =====================================================
// LOAD DOCTORS
// =====================================================

async function loadDoctors() {

    const doctorList =
        document.getElementById(
            "doctorList"
        );


    try {


        const response =
            await fetch(
                `${API_BASE_URL}/api/doctors`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load doctors"
            );

        }


        const doctors =
            await response.json();


        populateDoctorDropdowns(
            doctors
        );


        if (!doctorList) {

            return;

        }


        if (doctors.length === 0) {

            doctorList.innerHTML = `

                <div class="empty-message">

                    No doctors found.

                </div>

            `;

            return;

        }


        doctorList.innerHTML =
            "";


        doctors.forEach(
            function (doctor) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "data-card";


                card.innerHTML = `

                    <h3>

                        👨‍⚕️

                        ${escapeHtml(
                            doctor.name
                        )}

                    </h3>


                    <p>

                        <strong>
                            Doctor ID:
                        </strong>

                        ${doctor.doctorId}

                    </p>


                    <p>

                        <strong>
                            Specialization:
                        </strong>

                        ${escapeHtml(
                            doctor.specialization
                        )}

                    </p>


                    <p>

                        <strong>
                            Consultation Time:
                        </strong>

                        ${doctor.averageConsultationTime}
                        minutes

                    </p>

                `;


                doctorList.appendChild(
                    card
                );


            }
        );


    } catch (error) {


        console.error(
            "Doctor loading error:",
            error
        );


        if (doctorList) {

            doctorList.innerHTML = `

                <div class="empty-message">

                    Unable to load doctors.

                </div>

            `;

        }

    }

}


// =====================================================
// LOAD PATIENTS
// =====================================================

async function loadPatients() {

    const patientList =
        document.getElementById(
            "patientList"
        );


    try {


        const response =
            await fetch(
                `${API_BASE_URL}/api/patients`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        populatePatientDropdown(
            patients
        );


        if (!patientList) {

            return;

        }


        if (patients.length === 0) {

            patientList.innerHTML = `

                <div class="empty-message">

                    No patients found.

                </div>

            `;

            return;

        }


        patientList.innerHTML =
            "";


        patients.forEach(
            function (patient) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "data-card";


                card.innerHTML = `

                    <h3>

                        👤

                        ${escapeHtml(
                            patient.name
                        )}

                    </h3>


                    <p>

                        <strong>
                            Patient ID:
                        </strong>

                        ${patient.patientId}

                    </p>


                    <p>

                        <strong>
                            Phone:
                        </strong>

                        ${escapeHtml(
                            patient.phone
                        )}

                    </p>

                `;


                patientList.appendChild(
                    card
                );


            }
        );


    } catch (error) {


        console.error(
            "Patient loading error:",
            error
        );


        if (patientList) {

            patientList.innerHTML = `

                <div class="empty-message">

                    Unable to load patients.

                </div>

            `;

        }

    }

}


// =====================================================
// DOCTOR DROPDOWNS
// =====================================================

function populateDoctorDropdowns(
    doctors
) {


    const tokenDoctor =
        document.getElementById(
            "tokenDoctor"
        );


    const queueDoctor =
        document.getElementById(
            "queueDoctor"
        );


    const historyDoctor =
        document.getElementById(
            "historyDoctor"
        );



    // ---------------------------------------------
    // TOKEN DOCTOR
    // ---------------------------------------------

    if (tokenDoctor) {


        tokenDoctor.innerHTML = `

            <option value="">
                Select Doctor
            </option>

        `;


        doctors.forEach(
            function (doctor) {


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    doctor.doctorId;


                option.textContent =
                    `${doctor.name} - ${doctor.specialization}`;


                tokenDoctor.appendChild(
                    option
                );


            }
        );

    }



    // ---------------------------------------------
    // QUEUE DOCTOR
    // ---------------------------------------------

    if (queueDoctor) {


        queueDoctor.innerHTML = `

            <option value="">
                Select Doctor
            </option>

        `;


        doctors.forEach(
            function (doctor) {


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    doctor.doctorId;


                option.textContent =
                    `${doctor.name} - ${doctor.specialization}`;


                queueDoctor.appendChild(
                    option
                );


            }
        );

    }



    // ---------------------------------------------
    // HISTORY DOCTOR
    // ---------------------------------------------

    if (historyDoctor) {


        historyDoctor.innerHTML = `

            <option value="">
                Select Doctor
            </option>

        `;


        doctors.forEach(
            function (doctor) {


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    doctor.doctorId;


                option.textContent =
                    `${doctor.name} - ${doctor.specialization}`;


                historyDoctor.appendChild(
                    option
                );


            }
        );

    }

}


// =====================================================
// PATIENT DROPDOWN
// =====================================================

function populatePatientDropdown(
    patients
) {


    const tokenPatient =
        document.getElementById(
            "tokenPatient"
        );


    if (!tokenPatient) {

        return;

    }


    tokenPatient.innerHTML = `

        <option value="">
            Select Patient
        </option>

    `;


    patients.forEach(
        function (patient) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                patient.patientId;


            option.textContent =
                `${patient.name} - ${patient.phone}`;


            tokenPatient.appendChild(
                option
            );


        }
    );

}


// =====================================================
// GENERATE TOKEN
// =====================================================

async function generateToken() {


    const doctorId =
        document.getElementById(
            "tokenDoctor"
        ).value;


    const patientId =
        document.getElementById(
            "tokenPatient"
        ).value;


    const priority =
        document.getElementById(
            "priorityToken"
        ).checked;



    if (!doctorId) {

        alert(
            "Please select a doctor."
        );

        return;

    }


    if (!patientId) {

        alert(
            "Please select a patient."
        );

        return;

    }


    try {


        const url =
            `${API_BASE_URL}/api/tokens` +
            `?doctorId=${doctorId}` +
            `&patientId=${patientId}` +
            `&priority=${priority}`;


        const response =
            await fetch(
                url,
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Unable to generate token."
            );

            return;

        }


        displayTokenResult(
            data
        );


        document.getElementById(
            "tokenDoctor"
        ).value = "";


        document.getElementById(
            "tokenPatient"
        ).value = "";


        document.getElementById(
            "priorityToken"
        ).checked = false;


        loadDashboardData();


    } catch (error) {


        console.error(
            "Token generation error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// =====================================================
// DISPLAY GENERATED TOKEN
// =====================================================

function displayTokenResult(
    token
) {


    const result =
        document.getElementById(
            "tokenResult"
        );


    if (!result) {

        return;

    }


    result.classList.remove(
        "hidden"
    );


    result.innerHTML = `

        <h2>
            Token #${token.tokenNumber}
        </h2>


        <p>

            <strong>
                Patient:
            </strong>

            ${escapeHtml(
                token.patient.name
            )}

        </p>


        <p>

            <strong>
                Doctor:
            </strong>

            ${escapeHtml(
                token.doctor.name
            )}

        </p>


        <p>

            <strong>
                Status:
            </strong>

            ${token.status}

        </p>


        <p>

            <strong>
                Estimated Wait:
            </strong>

            ${token.estimatedWaitTime}
            minutes

        </p>


        ${
            token.priority

                ? `

                    <p>

                        <strong>

                            ⭐ PRIORITY TOKEN

                        </strong>

                    </p>

                  `

                : ""

        }

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================================
// LOAD LIVE QUEUE
// =====================================================

async function loadQueue() {


    const queueDoctor =
        document.getElementById(
            "queueDoctor"
        );


    const queueList =
        document.getElementById(
            "queueList"
        );


    if (
        !queueDoctor ||
        !queueList
    ) {

        return;

    }


    const doctorId =
        queueDoctor.value;


    if (!doctorId) {

        queueList.innerHTML = `

            <div class="empty-message">

                📋 Please select a doctor.

            </div>

        `;

        return;

    }


    try {


        const response =
            await fetch(
                `${API_BASE_URL}/api/tokens/doctors/${doctorId}/queue`
            );


        const queue =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Unable to load queue"
            );

        }


        if (queue.length === 0) {

            queueList.innerHTML = `

                <div class="empty-message">

                    🎉 No patients are waiting.

                </div>

            `;

            return;

        }


        queueList.innerHTML =
            "";


        queue.forEach(
            function (token) {


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "queue-item";


                item.innerHTML = `

                    <div class="queue-number">

                        ${token.tokenNumber}

                    </div>


                    <div class="queue-info">

                        <h3>

                            ${escapeHtml(
                                token.patient.name
                            )}

                        </h3>


                        <p>

                            Patient ID:
                            ${token.patient.patientId}

                        </p>

                    </div>


                    ${
                        token.priority

                            ? `

                                <span
                                    class="priority-badge">

                                    ⭐ PRIORITY

                                </span>

                              `

                            : ""

                    }


                    <div class="wait-time">

                        ${token.estimatedWaitTime}
                        min

                    </div>

                `;


                queueList.appendChild(
                    item
                );


            }
        );


    } catch (error) {


        console.error(
            "Queue loading error:",
            error
        );


        queueList.innerHTML = `

            <div class="empty-message">

                ❌ Unable to load queue.

            </div>

        `;

    }

}


// =====================================================
// ADVANCE QUEUE
// =====================================================

async function advanceQueue() {


    const queueDoctor =
        document.getElementById(
            "queueDoctor"
        );


    if (!queueDoctor) {

        return;

    }


    const doctorId =
        queueDoctor.value;


    if (!doctorId) {

        alert(
            "Please select a doctor."
        );

        return;

    }


    try {


        const response =
            await fetch(
                `${API_BASE_URL}/api/tokens/doctors/${doctorId}/next`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Unable to advance queue."
            );

            return;

        }


        alert(
            `Token #${data.tokenNumber} is now serving ${data.patient.name}.`
        );


        loadQueue();

        loadDashboardData();


        // Also refresh history if
        // a doctor is selected there

        const historyDoctor =
            document.getElementById(
                "historyDoctor"
            );


        if (
            historyDoctor &&
            historyDoctor.value === doctorId
        ) {

            loadHistory();

        }


    } catch (error) {


        console.error(
            "Queue advance error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// =====================================================
// LOAD TOKEN HISTORY
// =====================================================

async function loadHistory() {


    const historyDoctor =
        document.getElementById(
            "historyDoctor"
        );


    const historyList =
        document.getElementById(
            "historyList"
        );


    if (
        !historyDoctor ||
        !historyList
    ) {

        return;

    }


    const doctorId =
        historyDoctor.value;


    if (!doctorId) {

        historyList.innerHTML = `

            <div class="empty-message">

                📋 Please select a doctor
                to view token history.

            </div>

        `;

        return;

    }


    try {


        const response =
            await fetch(
                `${API_BASE_URL}/api/tokens/doctors/${doctorId}/history`
            );


        const history =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Unable to load history"
            );

        }


        if (history.length === 0) {

            historyList.innerHTML = `

                <div class="empty-message">

                    📋 No token history available
                    for this doctor today.

                </div>

            `;

            return;

        }


        let tableHTML = `

            <table class="history-table">

                <thead>

                    <tr>

                        <th>
                            Token
                        </th>

                        <th>
                            Patient
                        </th>

                        <th>
                            Priority
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Wait
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

        `;


        history.forEach(
            function (token) {


                tableHTML += `

                    <tr>

                        <td>

                            <strong>

                                #${token.tokenNumber}

                            </strong>

                        </td>


                        <td>

                            ${escapeHtml(
                                token.patient.name
                            )}

                        </td>


                        <td>

                            ${
                                token.priority
                                    ? "⭐ Yes"
                                    : "No"
                            }

                        </td>


                        <td>

                            <span
                                class="status status-${token.status}">

                                ${token.status}

                            </span>

                        </td>


                        <td>

                            ${token.estimatedWaitTime}
                            min

                        </td>


                        <td>

                            ${
                                token.status ===
                                "WAITING"

                                    ? `

                                        <button
                                            class="cancel-button"
                                            onclick="cancelToken(${token.tokenId})">

                                            Cancel

                                        </button>

                                      `

                                    : "-"

                            }

                        </td>

                    </tr>

                `;


            }
        );


        tableHTML += `

                </tbody>

            </table>

        `;


        historyList.innerHTML =
            tableHTML;


    } catch (error) {


        console.error(
            "History loading error:",
            error
        );


        historyList.innerHTML = `

            <div class="empty-message">

                ❌ Unable to load token history.

            </div>

        `;

    }

}


// =====================================================
// CANCEL TOKEN
// =====================================================

async function cancelToken(
    tokenId
) {


    const confirmation =
        confirm(
            "Are you sure you want to cancel this token?"
        );


    if (!confirmation) {

        return;

    }


    try {


        const response =
            await fetch(
                `${API_BASE_URL}/api/tokens/${tokenId}/cancel`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Unable to cancel token."
            );

            return;

        }


        alert(
            `Token #${data.tokenNumber} cancelled successfully.`
        );


        loadDashboardData();

        loadQueue();

        loadHistory();


    } catch (error) {


        console.error(
            "Token cancellation error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(
    value
) {


    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}