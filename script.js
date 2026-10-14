
/* =====================================================
   RUQYAH NOOR - COMPLETE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     WHATSAPP NUMBER
  ===================================================== */

  const WHATSAPP_NUMBER = "923136518694";


  /* =====================================================
     BASIC HELPERS
  ===================================================== */

  function getElement(id) {
    return document.getElementById(id);
  }

  function getValue(id) {
    const element = getElement(id);
    return element ? element.value.trim() : "";
  }

  function setMessage(element, message) {
    if (element) {
      element.textContent = message;
    }
  }


  /* =====================================================
     FIELD ERROR HANDLING
  ===================================================== */

  function clearFieldError(field) {
    if (!field) return;

    field.classList.remove("field-error");
    field.removeAttribute("aria-invalid");

    field.style.borderColor = "";
    field.style.outline = "";

    const errorId = field.id + "-error";
    const errorElement = getElement(errorId);

    if (errorElement) {
      errorElement.remove();
    }

    const describedBy = field.getAttribute("aria-describedby");

    if (describedBy) {
      const remainingIds = describedBy
        .split(/\s+/)
        .filter(function (id) {
          return id !== errorId;
        });

      if (remainingIds.length) {
        field.setAttribute(
          "aria-describedby",
          remainingIds.join(" ")
        );
      } else {
        field.removeAttribute("aria-describedby");
      }
    }
  }


  function showFieldError(fieldId, message) {
    const field = getElement(fieldId);

    if (!field) return false;

    clearFieldError(field);

    field.classList.add("field-error");
    field.setAttribute("aria-invalid", "true");

    /* Red border for the incorrect field */
    field.style.setProperty("border", "2px solid #d93025", "important");
    field.style.setProperty("outline", "none");

    /* Create the error message */
    const error = document.createElement("div");

    error.id = fieldId + "-error";
    error.className = "field-error-message";
    error.textContent = message;
    error.setAttribute("role", "alert");

    error.style.color = "#d93025";
    error.style.fontSize = "14px";
    error.style.marginTop = "5px";
    error.style.marginBottom = "10px";
    error.style.lineHeight = "1.5";
    error.style.display = "block";

    /* Place the message directly after the field */
    field.insertAdjacentElement("afterend", error);

    /* Connect the error message to the field */
    const existingDescription =
      field.getAttribute("aria-describedby");

    const descriptionIds = existingDescription
      ? existingDescription.split(/\s+/)
      : [];

    if (!descriptionIds.includes(error.id)) {
      descriptionIds.push(error.id);
    }

    field.setAttribute(
      "aria-describedby",
      descriptionIds.join(" ")
    );

    /* Move the user to the incorrect field */
    field.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    try {
      field.focus({ preventScroll: true });
    } catch (error) {
      field.focus();
    }

    return true;
  }


  function clearFormErrors(form) {
    if (!form) return;

    form.querySelectorAll("[aria-invalid='true']").forEach(
      function (field) {
        clearFieldError(field);
      }
    );

    form.querySelectorAll(".field-error-message").forEach(
      function (error) {
        error.remove();
      }
    );
  }


  /* =====================================================
     CLEAR ERRORS WHEN USER CORRECTS A FIELD
  ===================================================== */

  document.addEventListener("input", function (event) {
    const field = event.target;

    if (
      field &&
      field.id &&
      field.getAttribute("aria-invalid") === "true"
    ) {
      clearFieldError(field);
    }
  });

  document.addEventListener("change", function (event) {
    const field = event.target;

    if (
      field &&
      field.id &&
      field.getAttribute("aria-invalid") === "true"
    ) {
      clearFieldError(field);
    }
  });


  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const menuToggle =
    getElement("menuToggle") ||
    document.querySelector(".menu-toggle");

  const mainNav =
    getElement("mainNav") ||
    document.querySelector(".main-nav");

  if (menuToggle && mainNav) {

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      mainNav.classList.toggle("active");

      menuToggle.setAttribute(
        "aria-expanded",
        mainNav.classList.contains("active") ? "true" : "false"
      );
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (
        mainNav.classList.contains("active") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        mainNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }


  /* =====================================================
     FAQ ACCORDION
  ===================================================== */

  document.querySelectorAll(".faq-question").forEach(
    function (question) {

      question.addEventListener("click", function () {

        const faqItem = question.closest(".faq-item");

        if (!faqItem) return;

        const answer = faqItem.querySelector(".faq-answer");

        if (!answer) return;

        const wasActive = faqItem.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach(
          function (item) {

            item.classList.remove("active");

            const itemAnswer =
              item.querySelector(".faq-answer");

            if (itemAnswer) {
              itemAnswer.style.maxHeight = null;
            }

            const itemQuestion =
              item.querySelector(".faq-question");

            if (itemQuestion) {
              itemQuestion.setAttribute(
                "aria-expanded",
                "false"
              );
            }
          }
        );

        if (!wasActive) {

          faqItem.classList.add("active");

          question.setAttribute("aria-expanded", "true");

          answer.style.maxHeight =
            answer.scrollHeight + "px";
        }
      });
    }
  );


  /* =====================================================
     WHATSAPP FUNCTION
  ===================================================== */

  function openWhatsApp(message) {

    if (
      !WHATSAPP_NUMBER ||
      WHATSAPP_NUMBER === "000000000000"
    ) {
      alert(
        "Please add your WhatsApp number in script.js first."
      );

      return false;
    }

    const encodedMessage = encodeURIComponent(message);

    const whatsappURL =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodedMessage;

    try {

      const whatsappWindow = window.open(
        whatsappURL,
        "_blank"
      );

      if (!whatsappWindow) {
        return false;
      }

      try {
        whatsappWindow.opener = null;
      } catch (error) {
        /* Continue if opener cannot be changed */
      }

      return true;

    } catch (error) {
      return false;
    }
  }


  function showWhatsAppResult(messageElement, opened) {

    if (opened) {

      setMessage(
        messageElement,
        "WhatsApp opened. Please review your message and press Send. Your form details have been kept."
      );

    } else {

      setMessage(
        messageElement,
        "WhatsApp could not open. Please allow pop-ups in your browser and try again. Your form details are still available."
      );
    }
  }


  /* =====================================================
     DROPDOWN OPTION HELPER
  ===================================================== */

  function addOptionIfMissing(selectElement, value, text) {

    if (!selectElement) return;

    const exists = Array.from(selectElement.options).some(
      function (option) {
        return option.value === String(value);
      }
    );

    if (!exists) {

      const option = document.createElement("option");

      option.value = String(value);
      option.textContent = String(text);

      selectElement.appendChild(option);
    }
  }


  /* =====================================================
     DATE DROPDOWNS
  ===================================================== */

  const dateDay = getElement("dateDay");
  const dateMonth = getElement("dateMonth");
  const dateYear = getElement("dateYear");

  /* Days: 01–31 */

  if (dateDay) {

    for (let day = 1; day <= 31; day++) {

      const dayText = String(day).padStart(2, "0");

      addOptionIfMissing(dateDay, dayText, dayText);
    }
  }

  /* Months */

  if (dateMonth) {

    const months = [
      ["01", "January"],
      ["02", "February"],
      ["03", "March"],
      ["04", "April"],
      ["05", "May"],
      ["06", "June"],
      ["07", "July"],
      ["08", "August"],
      ["09", "September"],
      ["10", "October"],
      ["11", "November"],
      ["12", "December"]
    ];

    months.forEach(function (month) {
      addOptionIfMissing(dateMonth, month[0], month[1]);
    });
  }

  /* Current year and next two years */

  if (dateYear) {

    const currentYear = new Date().getFullYear();

    for (
      let year = currentYear;
      year <= currentYear + 2;
      year++
    ) {
      addOptionIfMissing(dateYear, year, year);
    }
  }


  /* =====================================================
     TIME DROPDOWNS
  ===================================================== */

  const timeHour = getElement("timeHour");
  const timeMinute = getElement("timeMinute");
  const timePeriod = getElement("timePeriod");

  /* Hours: 01–12 */

  if (timeHour) {

    for (let hour = 1; hour <= 12; hour++) {

      const hourText = String(hour).padStart(2, "0");

      addOptionIfMissing(timeHour, hourText, hourText);
    }
  }

  /* Minutes: 00–59 */

  if (timeMinute) {

    for (let minute = 0; minute <= 59; minute++) {

      const minuteText = String(minute).padStart(2, "0");

      addOptionIfMissing(timeMinute, minuteText, minuteText);
    }
  }

  /* AM / PM */

  if (timePeriod) {

    addOptionIfMissing(timePeriod, "AM", "AM");
    addOptionIfMissing(timePeriod, "PM", "PM");
  }


  /* =====================================================
     VALIDATE CALENDAR DATE
  ===================================================== */

  function isValidDate(day, month, year) {

    const numericDay = Number(day);
    const numericMonth = Number(month);
    const numericYear = Number(year);

    const date = new Date(
      numericYear,
      numericMonth - 1,
      numericDay
    );

    return (
      date.getFullYear() === numericYear &&
      date.getMonth() === numericMonth - 1 &&
      date.getDate() === numericDay
    );
  }


  /* =====================================================
     CHECK WHETHER DATE IS IN THE PAST
  ===================================================== */

  function isPastDate(day, month, year) {

    const selectedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return selectedDate < today;
  }


  /* =====================================================
     APPOINTMENT FORM
  ===================================================== */

  const appointmentForm = getElement("appointmentForm");

  if (appointmentForm) {

    appointmentForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        const formMessage = getElement("formMessage");

        setMessage(formMessage, "");

        clearFormErrors(appointmentForm);


        /* Read fields */

        const name = getValue("name");
        const country = getValue("country");
        const city = getValue("city");
        const age = getValue("age");
        const gender = getValue("gender");
        const language = getValue("language");
        const whatsapp = getValue("whatsapp");

        const day = getValue("dateDay");
        const month = getValue("dateMonth");
        const year = getValue("dateYear");

        const selectedHour = getValue("timeHour");
        const selectedMinute = getValue("timeMinute");
        const selectedPeriod = getValue("timePeriod");

        const concern = getValue("concern");

        const consentElement = getElement("consent");

        const consent = consentElement
          ? consentElement.checked
          : false;


        /* =============================================
           FIELD-BY-FIELD VALIDATION
        ============================================= */

        if (!name) {
          showFieldError("name", "Please enter your name.");
          return;
        }

        if (!country) {
          showFieldError("country", "Please enter your country.");
          return;
        }

        if (!whatsapp) {
          showFieldError(
            "whatsapp",
            "Please enter your WhatsApp number."
          );
          return;
        }

        if (!language) {
          showFieldError(
            "language",
            "Please select your preferred language."
          );
          return;
        }

        if (!day) {
          showFieldError("dateDay", "Please select the day.");
          return;
        }

        if (!month) {
          showFieldError("dateMonth", "Please select the month.");
          return;
        }

        if (!year) {
          showFieldError("dateYear", "Please select the year.");
          return;
        }

        if (!isValidDate(day, month, year)) {
          showFieldError(
            "dateDay",
            "This date does not exist. Please check the day, month and year."
          );
          return;
        }

        if (isPastDate(day, month, year)) {
          showFieldError(
            "dateDay",
            "Please select today or a future date."
          );
          return;
        }

        if (!selectedHour) {
          showFieldError("timeHour", "Please select the hour.");
          return;
        }

        if (!selectedMinute) {
          showFieldError("timeMinute", "Please select the minute.");
          return;
        }

        if (!selectedPeriod) {
          showFieldError("timePeriod", "Please select AM or PM.");
          return;
        }

        if (!concern) {
          showFieldError(
            "concern",
            "Please describe your concern."
          );
          return;
        }

        if (!consent) {

          if (consentElement) {
            showFieldError(
              "consent",
              "Please confirm the consent checkbox."
            );
          } else {
            setMessage(
              formMessage,
              "Please confirm the consent checkbox."
            );
          }

          return;
        }


        /* =============================================
           FORMAT DATE AND TIME
        ============================================= */

        const monthNames = {
          "01": "January",
          "02": "February",
          "03": "March",
          "04": "April",
          "05": "May",
          "06": "June",
          "07": "July",
          "08": "August",
          "09": "September",
          "10": "October",
          "11": "November",
          "12": "December"
        };

        const preferredDate =
          String(day).padStart(2, "0") +
          " " +
          monthNames[month] +
          " " +
          year;

        const preferredTime =
          selectedHour +
          ":" +
          selectedMinute +
          " " +
          selectedPeriod;


        /* =============================================
           BUILD WHATSAPP MESSAGE
        ============================================= */

        let message =
          "Assalamu Alaikum, I would like to request a Ruqyah session from Ruqyah Noor.\n\n";

        message += "Name: " + name + "\n";
        message += "Country: " + country + "\n";

        if (city) {
          message += "City: " + city + "\n";
        }

        if (age) {
          message += "Age: " + age + "\n";
        }

        if (gender) {
          message += "Gender: " + gender + "\n";
        }

        message += "Preferred Language: " + language + "\n";
        message += "My WhatsApp: " + whatsapp + "\n";
        message += "Preferred Date: " + preferredDate + "\n";
        message += "Preferred Time: " + preferredTime + "\n";
        message += "\nConcern:\n" + concern;


        /* =============================================
           OPEN WHATSAPP
           KEEP FORM DATA
        ============================================= */

        const whatsappOpened = openWhatsApp(message);

        showWhatsAppResult(formMessage, whatsappOpened);

      }
    );
  }


  /* =====================================================
     CONTACT FORM
  ===================================================== */

  const contactForm = getElement("contactForm");

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        const contactFormMessage =
          getElement("contactFormMessage");

        setMessage(contactFormMessage, "");

        clearFormErrors(contactForm);


        /* Read fields */

        const contactName = getValue("contactName");
        const contactCountry = getValue("contactCountry");
        const contactWhatsApp = getValue("contactWhatsApp");
        const contactMessage = getValue("contactMessage");


        /* =============================================
           FIELD-BY-FIELD VALIDATION
        ============================================= */

        if (!contactName) {
          showFieldError(
            "contactName",
            "Please enter your name."
          );
          return;
        }

        if (!contactMessage) {
          showFieldError(
            "contactMessage",
            "Please enter your message."
          );
          return;
        }


        /* =============================================
           BUILD CONTACT MESSAGE
        ============================================= */

        let message =
          "Assalamu Alaikum, I would like to contact Ruqyah Noor.\n\n";

        message += "Name: " + contactName + "\n";

        if (contactCountry) {
          message += "Country: " + contactCountry + "\n";
        }

        if (contactWhatsApp) {
          message += "My WhatsApp: " + contactWhatsApp + "\n";
        }

        message += "\nMessage:\n" + contactMessage;


        /* =============================================
           OPEN WHATSAPP
           KEEP FORM DATA
        ============================================= */

        const whatsappOpened = openWhatsApp(message);

        showWhatsAppResult(
          contactFormMessage,
          whatsappOpened
        );

      }
    );
  }


  /* =====================================================
     WHATSAPP BUTTON
  ===================================================== */

  const whatsappButton = getElement("whatsappButton");

  if (whatsappButton) {

    whatsappButton.addEventListener(
      "click",
      function (event) {

        const message =
          "Assalamu Alaikum, I would like to contact Ruqyah Noor regarding Ruqyah guidance.";

        const whatsappOpened = openWhatsApp(message);

        if (!whatsappOpened) {
          event.preventDefault();

          alert(
            "WhatsApp could not open. Please allow pop-ups in your browser and try again."
          );
        }
      }
    );
  }


  /* =====================================================
     CURRENT YEAR
  ===================================================== */

  const yearElement = getElement("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});

