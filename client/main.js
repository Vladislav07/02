(async function () {
  let clientsList = [
    {
      id: "1234567890",
      createdAt: "2021-02-03T13:07:29.554Z",
      updatedAt: "2021-02-03T13:07:29.554Z",
      name: "Василий",
      surname: "Пупкин",
      lastName: "Васильевич",
      contacts: [
        {
          type: "Телефон",
          value: "+71234567890",
        },
        {
          type: "Email",
          value: "abc@xyz.com",
        },
        {
          type: "Facebook",
          value: "https://facebook.com/vasiliy-pupkin-the-best",
        },
      ],
    },
    {
      id: "1234567891",
      createdAt: "2021-02-03T13:07:29.554Z",
      updatedAt: "2021-02-03T13:07:29.554Z",
      name: "Василий",
      surname: "Пупкин",
      lastName: "Васильевич",
      contacts: [
        {
          type: "Телефон",
          value: "+71234567890",
        },
        {
          type: "Email",
          value: "abc@xyz.com",
        },
        {
          type: "Facebook",
          value: "https://facebook.com/vasiliy-pupkin-the-best",
        },
      ],
    },
  ];

  async function GetClientsFromServer() {
    const response = await fetch(`http://localhost:3000/api/clients`);
    const clients = await response.json();
    return clients;
  }

  async function AddStudentToServer(student) {
    const res = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name: student.name,
        surname: student.surname,
        lastname: student.lastname,
        birthday: student.birthday,
        studyStart: student.studyStart,
        faculty: student.faculty,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  }

  async function EditingStudentToServer(student) {
    const res = await fetch(`http://localhost:3000/api/clients/${student.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: student.name,
        surname: student.surname,
        lastname: student.lastname,
        birthday: student.birthday,
        studyStart: student.studyStart,
        faculty: student.faculty,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  }

  async function DeleteStudentFromServer(studentId) {
    const res = await fetch(`http://localhost:3000/api/clients/${studentId}`, {
      method: "DELETE",
    });
    return res;
  }

  async function GetStudentFromServerID(studentId) {
    const response = await fetch(
      `http://localhost:3000/api/clients/${studentId}`,
      {
        method: "GET",
      }
    );
    const student = await response.json();
    return student;
  }

  function getClientItem(clientObj) {
    const row = document.createElement("tr");
    const id = document.createElement("th");
    const fullName = document.createElement("td");
    const createdAt = document.createElement("td");
    const updatedAt = document.createElement("td");
    const actions = document.createElement("td");

    const buttonGroup = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    buttonGroup.classList.add("btn-group", "btn-group");
    editButton.classList.add("btn", "btn-success");
    editButton.textContent = "Редактировать";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";
    buttonGroup.append(editButton);
    buttonGroup.append(deleteButton);
    actions.append(buttonGroup);

    id.setAttribute("scope", "row");
    id.textContent = clientObj.id;
    row.append(id);

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        const indexItem = parseInt(id.value);
        DeleteStudentFromServer(indexItem);
        row.remove();
      }
    });

    editButton.addEventListener("click", async function () {
      const container = document.querySelector(".container");
      const indexItem = parseInt(id.value);
      const studentEdit = await GetStudentFromServerID(indexItem);
      ClearPageTable();
      container.append(AddStudent(studentEdit));
    });

    fullName.textContent = GetFullName(clientObj);
    updatedAt.textContent = GetDate(clientObj.updatedAt);
    createdAt.textContent = GetDate(clientObj.createdAt);
    const contacts = GetContacts(clientObj.contacts);
    row.append(fullName);
    row.append(updatedAt);
    row.append(createdAt);
    row.append(contacts);
    row.append(actions);
    return row;
  }

  function GetContacts(array) {
    const contacts = document.createElement("td");
    const imgGroup = document.createElement("div");
    imgGroup.classList.add("btn-group");
    array.forEach((element) => {
      const img = document.createElement("img");
      switch (element.type) {
        case "Facebook":
          img.setAttribute("src", "./img/fb.svg");
          break;
        case "Телефон":
          img.setAttribute("src", "./img/phone.svg");
          break;
        case "Email":
          img.setAttribute("src", "./img/mail.svg");
          break;

        default:
          break;
      }
      img.classList.add("clients__img");
      imgGroup.append(img);
    });

    contacts.append(imgGroup);
    return contacts;
  }

  function GetPeridOfStudy(years) {
    let yearOfEnding = parseInt(years) + 4;
    let period = years + "-" + yearOfEnding.toString();
    return period;
  }

  function GetFullName(clientObj) {
    let fullName =
      clientObj.surname.trim() +
      " " +
      clientObj.name.trim() +
      " " +
      clientObj.lastName.trim();
    return fullName;
  }

  function GetDate(date) {
    let formatDate = new Date(date);
    let result =
      formatDate.getDate() +
      "." +
      formatDate.getMonth() +
      "." +
      formatDate.getFullYear() +
      " " +
      formatDate.getMinutes() +
      ":" +
      formatDate.getHours();
    return result;
  }

  // Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.
  //Функция должна использовать ранее созданную функцию создания одной записи для студента.
  //Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.

  function renderClientsTable(clientsArray) {
    const table = document.querySelector("thead");
    // const filter = CreateGroupFilter();
    // container.append(filter);

    // const table = document.createElement("table");
    // table.classList.add("table", "table-bordered");
    // const thead = document.createElement("thead");
    // const tr = document.createElement("tr");
    // const thName = document.createElement("th");

    // thName.setAttribute("scope", "col");
    // thName.textContent = "Ф. И. О.";
    // tr.append(thName);
    // thName.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   let result = Sortingclients(clientsList, "surname");
    //   ClearPageTable();
    //   renderclientsTable(result);
    // });

    // const thDep = document.createElement("th");
    // thDep.setAttribute("scope", "col");
    // thDep.textContent = "факультет";

    // thDep.addEventListener("click", () => {
    //   let result = Sortingclients(clientsList, "faculty");
    //   ClearPageTable();
    //   renderclientsTable(result);
    // });
    // tr.append(thDep);

    // const thAge = document.createElement("th");
    // thAge.setAttribute("scope", "col");
    // thAge.textContent = "дата рождения и возраст";
    // thAge.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   let result = Sortingclients(clientsList, "birthday");
    //   ClearPageTable();
    //   renderclientsTable(result);
    // });
    // tr.append(thAge);

    // const thYars = document.createElement("th");
    // thYars.setAttribute("scope", "col");
    // thYars.textContent = "годы обучения";
    // thYars.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   let result = Sortingclients(clientsList, "studyStart");
    //   ClearPageTable();
    //   renderclientsTable(result);
    // });
    // tr.append(thYars);
    // thead.append(tr);
    // table.append(thead);

    const tBody = Renderclients(clientsArray);
    table.after(tBody);

    // const btnAdd = document.createElement("button");
    // btnAdd.classList.add("btn", "btn-primary");
    // btnAdd.textContent = "Добавить студента";
    // btnAdd.setAttribute("type", "submit");
    // btnAdd.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   filter.remove();
    //   table.remove();
    //   btnAdd.remove();
    //   container.append(AddStudent());
    // });

    // container.append(btnAdd);
  }

  function Renderclients(clientsArray) {
    const tBody = document.createElement("tbody");

    if (clientsArray) {
      for (const student of clientsArray) {
        tBody.append(getClientItem(student));
      }
    }
    return tBody;
  }

  function ClearPageTable() {
    let array = document.querySelector(".container").children;
    for (let index = array.length - 1; index >= 0; index--) {
      const el = array[index];
      el.remove();
    }
  }

  function CreateGroupFilter() {
    let arrFilterName = clientsList;
    let arrFilterDep = arrFilterName;
    let arrFilterStartStydy = arrFilterDep;
    const filter = document.createElement("div");
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group", "my-5");

    const labelFullName = document.createElement("label");
    labelFullName.setAttribute("for", "fullName");
    const inputFullName = document.createElement("input");
    inputFullName.setAttribute("type", "text");
    inputFullName.setAttribute("placeholder", "Ф. И. О.");
    inputFullName.setAttribute("id", "fullName");
    inputFullName.classList.add("form-control");
    inputFullName.addEventListener("input", (e) => {
      arrFilterName = FilteringFullName(clientsList, inputFullName.value);
      let table = document.querySelector("table");
      let tBody = document.querySelector("tbody");
      tBody.remove();
      tBody = Renderclients(arrFilterName);
      table.append(tBody);
    });
    inputGroup.append(inputFullName);

    const labelcontacts = document.createElement("label");
    labelcontacts.setAttribute("for", "faculty");
    const inputcontacts = document.createElement("input");
    inputcontacts.setAttribute("type", "text");
    inputcontacts.setAttribute("placeholder", "факультет");
    inputcontacts.setAttribute("id", "faculty");
    inputcontacts.classList.add("form-control");
    inputcontacts.addEventListener("input", (e) => {
      arrFilterDep = Filtering(arrFilterName, "faculty", inputcontacts.value);
      let table = document.querySelector("table");
      let tBody = document.querySelector("tbody");
      tBody.remove();
      tBody = Renderclients(arrFilterDep);
      table.append(tBody);
    });

    inputGroup.append(inputcontacts);
    const labelYearOfStudy = document.createElement("label");
    labelYearOfStudy.setAttribute("for", "studyStart");
    const inputYearOfStudy = document.createElement("input");
    inputYearOfStudy.setAttribute("type", "text");
    inputYearOfStudy.setAttribute("placeholder", "Год начала обучения");
    inputYearOfStudy.setAttribute("id", "studyStart");
    inputYearOfStudy.classList.add("form-control");
    inputYearOfStudy.addEventListener("input", (e) => {
      arrFilterStartStydy = Filtering(
        arrFilterDep,
        "studyStart",
        inputYearOfStudy.value
      );
      let table = document.querySelector("table");
      let tBody = document.querySelector("tbody");
      tBody.remove();
      tBody = Renderclients(arrFilterStartStydy);
      table.append(tBody);
    });

    inputGroup.append(inputYearOfStudy);

    const labelYearOfEnding = document.createElement("label");
    labelYearOfEnding.setAttribute("for", "YearOfEnding");
    const inputYearOfEnding = document.createElement("input");
    inputYearOfEnding.setAttribute("type", "text");
    inputYearOfEnding.setAttribute("placeholder", "Год окончания обучения");
    inputYearOfEnding.setAttribute("id", "YearOfEnding");
    inputYearOfEnding.classList.add("form-control");
    inputYearOfEnding.addEventListener("input", (e) => {
      let result = FilteringEndStudy(
        arrFilterStartStydy,
        inputYearOfEnding.value
      );
      let table = document.querySelector("table");
      let tBody = document.querySelector("tbody");
      tBody.remove();
      tBody = Renderclients(result);
      table.append(tBody);
    });

    inputGroup.append(inputYearOfEnding);
    filter.append(inputGroup);

    return filter;
  }

  // Этап 5. К форме добавления студента добавьте слушатель события отправки формы,
  // в котором будет проверка введенных данных.Если проверка пройдет успешно,
  // добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.

  function AddStudent(studentFromServer) {
    const form = document.createElement("form");
    form.classList.add("needs-validation", "my-5");
    form.setAttribute("novalidate", "true");
    const formRowFirst = document.createElement("div");
    formRowFirst.classList.add("form-row", "mb-5");

    const wrapperName = document.createElement("div");
    wrapperName.classList.add("col-4");
    const labelName = document.createElement("label");
    labelName.setAttribute("for", "name");
    labelName.textContent = "Введите имя";
    const inputName = document.createElement("input");
    inputName.classList.add("form-control");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("required", "true");
    inputName.setAttribute("id", "name");
    const validName = document.createElement("div");
    validName.classList.add("invalid-feedback");
    validName.textContent = "Поле не может быть пустым!";
    wrapperName.append(labelName);
    wrapperName.append(inputName);
    wrapperName.append(validName);
    formRowFirst.append(wrapperName);

    inputName.addEventListener("blur", () => {
      ValidFieldsNull(inputName);
    });

    const wrapperSurName = document.createElement("div");
    wrapperSurName.classList.add("col-4");
    const labelSurName = document.createElement("label");
    labelSurName.setAttribute("for", "surName");
    labelSurName.textContent = "Введите фамилию";
    const inputSurName = document.createElement("input");
    inputSurName.classList.add("form-control");
    inputSurName.setAttribute("type", "text");
    inputSurName.setAttribute("required", "true");
    inputSurName.setAttribute("id", "surName");
    const validSurName = document.createElement("div");
    validSurName.classList.add("invalid-feedback");
    validSurName.textContent = "Поле не может быть пустым!";
    wrapperSurName.append(labelSurName);
    wrapperSurName.append(inputSurName);
    wrapperSurName.append(validSurName);
    formRowFirst.append(wrapperSurName);

    inputSurName.addEventListener("blur", () => {
      ValidFieldsNull(inputSurName);
    });

    const wrapperLastName = document.createElement("div");
    wrapperLastName.classList.add("col-4");
    const labelLastName = document.createElement("label");
    labelLastName.setAttribute("for", "lastname`");
    labelLastName.textContent = "Введите отчество";
    const inputLastName = document.createElement("input");
    inputLastName.classList.add("form-control");
    inputLastName.setAttribute("type", "text");
    inputLastName.setAttribute("required", "true");
    inputLastName.setAttribute("id", "lastname`");
    const validLastName = document.createElement("div");
    validLastName.classList.add("invalid-feedback");
    validLastName.textContent = "Поле не может быть пустым!";
    wrapperLastName.append(labelLastName);
    wrapperLastName.append(inputLastName);
    wrapperLastName.append(validLastName);
    formRowFirst.append(wrapperLastName);

    inputLastName.addEventListener("blur", () => {
      ValidFieldsNull(inputLastName);
    });

    const formRowSecond = document.createElement("div");
    formRowSecond.classList.add("form-row", "mb-5");

    const wrapperDateOfBirth = document.createElement("div");
    wrapperDateOfBirth.classList.add("col-4");
    const labelDateOfBirth = document.createElement("label");
    labelDateOfBirth.setAttribute("for", "birthday");
    labelDateOfBirth.textContent = "Введите дату рождения";
    const inputDateOfBirth = document.createElement("input");
    inputDateOfBirth.classList.add("form-control");
    inputDateOfBirth.setAttribute("type", "date");
    inputDateOfBirth.setAttribute("required", "true");
    inputDateOfBirth.setAttribute("id", "birthday");
    inputDateOfBirth.setAttribute("aria-describedby", " ValidDateOfBirth");
    const validDateOfBirth = document.createElement("div");
    validDateOfBirth.setAttribute("id", "ValidDateOfBirth");
    validDateOfBirth.classList.add("invalid-feedback");
    validDateOfBirth.textContent = "Поле не может быть пустым!";
    wrapperDateOfBirth.append(labelDateOfBirth);
    wrapperDateOfBirth.append(inputDateOfBirth);
    wrapperDateOfBirth.append(validDateOfBirth);
    formRowSecond.append(wrapperDateOfBirth);

    inputDateOfBirth.addEventListener("blur", () => {
      ValidFildDateBirth(inputDateOfBirth, validDateOfBirth);
    });

    const wrapperYearOfStudy = document.createElement("div");
    wrapperYearOfStudy.classList.add("col-4");
    const labelYearOfStudy = document.createElement("label");
    labelYearOfStudy.setAttribute("for", "studyStart");
    labelYearOfStudy.textContent = "Введите год поступления";
    const inputYearOfStudy = document.createElement("input");
    inputYearOfStudy.classList.add("form-control");
    inputYearOfStudy.setAttribute("type", "date");
    inputYearOfStudy.setAttribute("required", "true");
    inputYearOfStudy.setAttribute("id", "studyStart");
    inputYearOfStudy.setAttribute("aria-describedby", "ValidYearOfStudy");
    const validYearOfStudy = document.createElement("div");
    validYearOfStudy.setAttribute("id", "ValidYearOfStudy");
    validYearOfStudy.textContent = "Поле не может быть пустым!";
    validYearOfStudy.classList.add("invalid-feedback");
    wrapperYearOfStudy.append(labelYearOfStudy);
    wrapperYearOfStudy.append(inputYearOfStudy);
    wrapperYearOfStudy.append(validYearOfStudy);
    formRowSecond.append(wrapperYearOfStudy);

    inputYearOfStudy.addEventListener("blur", () => {
      ValidFieldYearsStudy(inputYearOfStudy, validYearOfStudy);
    });

    const wrappercontacts = document.createElement("div");
    wrappercontacts.classList.add("col-4");
    const labelcontacts = document.createElement("label");
    labelcontacts.setAttribute("for", "faculty");
    labelcontacts.textContent = "введите факультет";
    const inputcontacts = document.createElement("input");
    inputcontacts.classList.add("form-control");
    inputcontacts.setAttribute("type", "text");
    inputcontacts.setAttribute("required", "true");
    inputcontacts.setAttribute("id", "faculty");
    const validcontacts = document.createElement("div");
    validcontacts.classList.add("invalid-feedback");
    validcontacts.textContent = "Поле не может быть пустым!";
    wrappercontacts.append(labelcontacts);
    wrappercontacts.append(inputcontacts);
    wrappercontacts.append(validcontacts);
    formRowSecond.append(wrappercontacts);

    inputcontacts.addEventListener("blur", () => {
      ValidFieldsNull(inputcontacts);
    });

    form.append(formRowFirst);
    form.append(formRowSecond);

    const btnSubmit = document.createElement("button");
    btnSubmit.classList.add("btn", "btn-primary", "mr-5");
    btnSubmit.textContent = "Добавить студента";
    btnSubmit.setAttribute("type", "submit");

    let studentId = null;

    form.addEventListener("submit", function (event) {
      let nameOut = inputName.value;
      let surNameOut = inputSurName.value;
      let lastNameOut = inputLastName.value;
      let contactsOut = inputcontacts.value;
      let yearOfStudyOut = inputYearOfStudy.valueAsDate;
      let dateOfBirthOut = inputDateOfBirth.valueAsDate;

      let isValidName = ValidFieldsNull(inputName);
      let isValidSurName = ValidFieldsNull(inputSurName);
      let isValidLastName = ValidFieldsNull(inputLastName);
      let isValidDepName = ValidFieldsNull(inputcontacts);
      let IsValidupdatedAt = ValidFildDateBirth(
        inputDateOfBirth,
        validDateOfBirth
      );
      let IsValidYearsStudy = ValidFieldYearsStudy(
        inputYearOfStudy,
        validYearOfStudy
      );

      if (
        !isValidName ||
        !isValidSurName ||
        !isValidLastName ||
        !isValidDepName ||
        !IsValidupdatedAt ||
        !IsValidYearsStudy
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const student = {
        name: nameOut,
        surname: surNameOut,
        lastname: lastNameOut,
        birthday: dateOfBirthOut,
        studyStart: yearOfStudyOut.getFullYear().toString(),
        faculty: contactsOut,
      };

      if (studentFromServer) {
        student.id = studentId;
        const res = EditingStudentToServer(student);
        if (!res.ok) {
          return;
        }
      } else {
        const res = AddStudentToServer(student);
        if (!res.ok) {
          return;
        }
      }
      clientsList = GetclientsFromServer();
      form.remove();
      renderclientsTable(clientsList);
    });

    form.append(btnSubmit);
    const btnCansel = document.createElement("button");
    btnCansel.classList.add("btn", "btn-primary");
    btnCansel.textContent = "Отмена";
    btnCansel.setAttribute("type", "button");

    btnCansel.addEventListener("click", (e) => {
      ClearPageTable();
      renderclientsTable(clientsList);
    });

    if (studentFromServer) {
      inputName.value = studentFromServer.name;
      inputLastName.value = studentFromServer.lastname;
      inputSurName.value = studentFromServer.surname;
      inputDateOfBirth.valueAsDate = new Date(studentFromServer.birthday);
      inputcontacts.value = studentFromServer.faculty;
      inputYearOfStudy.valueAsDate = new Date(studentFromServer.studyStart);
      studentId = studentFromServer.id;
      btnSubmit.classList.add("btn", "btn-success", "mr-5");
      btnSubmit.textContent = "Изменить данные студента";
    }

    form.append(btnCansel);
    return form;
  }

  function ValidFieldsNull(field) {
    if (field.value === "") {
      field.classList.add("is-invalid");
      return false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      return true;
    }
  }

  function ValidFieldYearsStudy(inputYearOfStudy, validYearOfStudy) {
    let yearOfStudyOut = inputYearOfStudy.valueAsDate;

    if (yearOfStudyOut === null) {
      validYearOfStudy.textContent = "Поле не может быть пустым!";
      inputYearOfStudy.classList.add("is-invalid");
      return false;
    } else if (yearOfStudyOut !== null && yearOfStudyOut.getFullYear() < 2000) {
      validYearOfStudy.textContent =
        "Год начала обучения должен находится в диапазоне от 2000-го до текущего года!";
      inputYearOfStudy.classList.add("is-invalid");
      return false;
    } else {
      inputYearOfStudy.classList.remove("is-invalid");
      inputYearOfStudy.classList.add("is-valid");
      return true;
    }
  }

  function ValidFildDateBirth(inputDateOfBirth, validDateOfBirth) {
    let dateOfBirthOut = inputDateOfBirth.valueAsDate;
    if (dateOfBirthOut === null) {
      validDateOfBirth.textContent = "Поле не может быть пустым!";
      inputDateOfBirth.classList.add("is-invalid");
      return false;
    } else if (
      dateOfBirthOut !== null &&
      dateOfBirthOut < new Date(1900, 01, 01)
    ) {
      validDateOfBirth.textContent =
        "Дата рождения должна находится в диапазоне от 01.01.1900 до текущей даты!";
      inputDateOfBirth.classList.add("is-invalid");
      return false;
    } else {
      inputDateOfBirth.classList.remove("is-invalid");
      inputDateOfBirth.classList.add("is-valid");
      return true;
    }
  }

  // Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.
  function Sortingclients(arr, prop, dir = false) {
    return arr.sort((a, b) =>
      dir ? a[prop] < b[prop] : a[prop] > b[prop] ? 1 : -1
    );
  }
  // Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.

  function FilteringFullName(arr, str) {
    const arrFiltered = [];
    str = str.toLowerCase();
    if (str === "") {
      return arr;
    }
    for (const item of arr) {
      if (
        item.surname.toLowerCase().includes(str) ||
        item.lastname.toLowerCase().includes(str) ||
        item.name.toLowerCase().includes(str)
      ) {
        arrFiltered.push(item);
      }
    }
    return arrFiltered;
  }

  function Filtering(arr, prop, str) {
    const arrFiltered = [];
    str = str.toLowerCase();
    if (str === "") {
      return arr;
    }
    for (const item of arr) {
      if (item[prop].toLowerCase().includes(str)) {
        arrFiltered.push(item);
      }
    }
    return arrFiltered;
  }

  function FilteringEndStudy(arr, str) {
    const arrFiltered = [];
    if (str === "") {
      return arr;
    }
    for (const item of arr) {
      let temp = GetPeridOfStudy(item.studyStart).substring(5);
      if (temp.includes(str)) {
        arrFiltered.push(item);
      }
    }
    return arrFiltered;
  }

  // clientsList = await GetclientsFromServer();

  renderClientsTable(clientsList);
})();
