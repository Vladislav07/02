(async function () {
  function RenderApp() {
    const body = document.querySelector("body");
    body.append(createHeader());
    body.append(createMainSection());
    createBodyTable();
  }

  function createHeader() {
    const header = document.createElement("header");
    const containerHeader = document.createElement("div");
    const row = document.createElement("div");
    const logo = document.createElement("a");
    const headerLogo = document.createElement("div");
    const logoTitle = document.createElement("span");
    const groupSearsh = document.createElement("div");
    const inputSearsh = document.createElement("input");

    logoTitle.classList.add("header__logo--title");
    logoTitle.textContent = "skb.";
    headerLogo.classList.add("header__logo");
    logo.classList.add("col-auto", "logo");
    logo.setAttribute("href", "/#");
    row.classList.add("row", "justify-items-start", "align-items-center");
    containerHeader.classList.add("container", "header__container");
    groupSearsh.classList.add("col-auto", "input-group", "header__group");
    inputSearsh.classList.add("form-control", "header__input");
    inputSearsh.setAttribute("type", "text");
    inputSearsh.setAttribute("placeholder", "Введите запрос");
    inputSearsh.setAttribute("aria-label", "поле ввода запроса");

    headerLogo.append(logoTitle);
    logo.append(headerLogo);
    groupSearsh.append(inputSearsh);
    row.append(logo);
    row.append(groupSearsh);
    containerHeader.append(row);
    header.append(containerHeader);
    return header;
  }

  function createMainSection() {
    const main = document.createElement("main");
    const Section = document.createElement("section");
    const containerSection = document.createElement("div");
    const titleSection = document.createElement("h1");

    titleSection.classList.add("clients__title");
    titleSection.textContent = "Клиенты";
    containerSection.classList.add(
      "container",
      "clients__container",
      "d-flex",
      "flex-column",
      "justify-items-center"
    );
    Section.classList.add("clients");
    main.classList.add("main");

    containerSection.append(titleSection);
    containerSection.append(createTable());
    containerSection.append(createBtnAddClient());
    Section.append(containerSection);
    main.append(Section);
    return main;
  }

  function createTable() {
    const table = document.createElement("table");
    const tHead = document.createElement("thead");
    const tr = document.createElement("tr");
    const thId = createTh("ID");
    thId.append(createImgHeader("идентификатор", "id"));
    const thName = createTh("Фамилия Имя Отчество");
    thName.append(
      createImgHeader("фамилия, имя, отчество", "name", "./img/а-я.svg")
    );
    const thDateCreated = createTh("Дата и время создания");

    thDateCreated.append(createImgHeader("Дата создания", "createdAt"));
    const thDateUpdated = createTh("Последние изменения");
    thDateUpdated.append(createImgHeader("Последнее изменение", "updatedAt"));

    const thContacts = createTh("Контакты");
    const thActions = createTh("Действия");
    tr.append(thId);
    tr.append(thName);
    tr.append(thDateCreated);

    tr.append(thDateUpdated);

    tr.append(thContacts);
    tr.append(thActions);
    tHead.append(tr);
    table.append(tHead);
    return table;
  }

  function createBtnAddClient() {
    const btnAddClient = document.createElement("button");
    btnAddClient.setAttribute("type", "button");
    btnAddClient.classList.add("btn", "btn-outline-secondary", "clients__btn");
    btnAddClient.textContent = "Добавить клиента";
    btnAddClient.addEventListener("click", () => {
      const modal = createModalWithForm(null, { onSave, onClose });
      document.body.append(modal);
      $("#my").on("hidden.bs.modal", () => {
        onClose(modal);
      });
      $("#my").modal("show");
    });
    return btnAddClient;
  }

  function createImgHeader(alt, prop, url = "./img/arrow_downward.svg") {
    let sortDirection = true;
    const imgHeader = document.createElement("img");
    imgHeader.classList.add("table__header--arrow", "btn-reset");
    imgHeader.setAttribute("src", url);
    imgHeader.setAttribute("alt", alt);
    imgHeader.addEventListener("click", () => {
      imgHeader.classList.toggle("table__sort--toggle");
      imgHeader.dispatchEvent(
        new CustomEvent("Sort", {
          detail: { column: prop, dir: sortDirection },
          bubbles: true,
        })
      );
      sortDirection = !sortDirection;
    });
    return imgHeader;
  }

  function createTh(text) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.classList.add("table__header");
    th.textContent = text;
    return th;
  }

  async function createBodyTable() {
    const listClients = await GetClientsFromServer();
    const formatedData = FormatingData(listClients);
    const table = document.querySelector("thead");
    const tBody = document.createElement("tbody");
    tBody.classList.add("table__content");
    renderRow(formatedData);
    table.addEventListener("Sort", (e) => {
      e.preventDefault();
      const column = e.detail.column;
      const direction = e.detail.dir;
      const arraySorted = Sortingclients(formatedData, column, direction);
      clearBody(tBody);
      renderRow(arraySorted);
    });

    table.after(tBody);

    function renderRow(list) {
      if (list) {
        for (const client of list) {
          tBody.append(createRowTable(client));
        }
      }
    }
  }

  function clearBody(tBody) {
    const count = tBody.children.length;
    for (let index = count; index > 0; index--) {
      tBody.children[index - 1].remove();
    }
  }

  function FormatingData(arr) {
    const newArr = arr.map((client) => {
      return {
        ...client,
        numberId: parseInt(client.id),
        fullName: GetFullName(client),
        dateCreated: new Date(client.createdAt),
        dateUpdated: new Date(client.updatedAt),
      };
    });
    return newArr;
  }

  function createRowTable(clientObj) {
    const row = document.createElement("tr");
    const id = document.createElement("th");
    const fullName = getRangeTd();
    const actions = getRangeTd();
    const buttonGroup = document.createElement("div");
    const editButton = GetButton("Редактировать", "./img/edit.svg");
    const deleteButton = GetButton("Удалить", "./img/cancel.svg");
    const dateCreated = getRangeTd();
    const dateUpdated = getRangeTd();

    row.classList.add("table__row");
    id.classList.add("table__clientId");
    buttonGroup.classList.add("btn-group", "btn-group");
    buttonGroup.append(editButton);
    buttonGroup.append(deleteButton);
    actions.append(buttonGroup);

    id.setAttribute("scope", "row");
    id.textContent = clientObj.numberId;
    row.append(id);
    fullName.textContent = clientObj.fullName;
    const contacts = GetContacts(clientObj.contacts);
    row.append(fullName);
    dateCreated.append(GetDate(clientObj.dateCreated));
    dateCreated.append(GetTime(clientObj.dateCreated));
    dateUpdated.append(GetDate(clientObj.dateUpdated));
    dateUpdated.append(GetTime(clientObj.dateUpdated));
    row.append(dateCreated);
    row.append(dateUpdated);
    row.append(contacts);
    row.append(actions);

    editButton.addEventListener("click", () => {
      const modal = createModalWithForm(clientObj, { onSave, onClose });
      document.body.append(modal);

      $("#my").on("hidden.bs.modal", () => {
        onClose(modal);
      });

      $("#my").modal("show");
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        DeleteClientFromServer(clientObj.id);
        row.remove();
      }
    });

    return row;
  }

  function createModalWithForm(client, { onSave, onClose }) {
    const modalElement = document.createElement("div");
    const dialog = document.createElement("div");
    const modalContent = document.createElement("div");
    const modalHeader = document.createElement("div");
    const modalTitle = document.createElement("h5");
    const clientIdNode = document.createElement("div");
    const btnClose = document.createElement("button");
    const iconBtn = document.createElement("span");
    const modalBody = document.createElement("div");
    const form = document.createElement("form");
    const modalFooter = document.createElement("div");
    const inputName = document.createElement("input");
    const inputSurName = document.createElement("input");
    const inputLastName = document.createElement("input");
    let countContacts = 0;

    modalElement.setAttribute("id", "my");
    modalElement.classList.add("modal", "fade");
    dialog.classList.add("modal-dialog");
    modalContent.classList.add("modal-content");
    modalHeader.classList.add("modal-header", "modal__header");
    modalTitle.classList.add("modal-title", "modal__title");
    clientIdNode.classList.add("modal__id");
    btnClose.setAttribute("type", "button");
    btnClose.setAttribute("data-dismiss", "modal");
    btnClose.setAttribute("aria-label", "Close");
    btnClose.classList.add("close");
    iconBtn.setAttribute("aria-hidden", "true");
    iconBtn.innerHTML = "&#215";
    modalBody.classList.add("modal-body");

    form.classList.add(
      "needs-validation",
      "modal__form",
      "d-flex",
      "flex-column",
      "align-items-center",
      "p-0"
    );
    form.setAttribute("novalidate", "true");

    modalHeader.append(modalTitle);
    modalHeader.append(clientIdNode);
    modalHeader.append(btnClose);
    modalContent.append(modalHeader);
    modalBody.append(form);
    btnClose.append(iconBtn);
    modalContent.append(modalBody);
    inputName.setAttribute("required", "required");
    inputSurName.setAttribute("required", "required");
    const groupName = GetGroupInput(inputName, "name");
    const groupSurName = GetGroupInput(inputSurName, "surname");
    const groupLastName = GetGroupInput(inputLastName, "lastName");
    groupName.append(AddValidField("Поле не может быть пустым!"));
    groupSurName.append(AddValidField("Поле не может быть пустым!"));

    inputName.addEventListener("blur", () => {
      ValidFieldsNull(inputName);
    });
    inputSurName.addEventListener("blur", () => {
      ValidFieldsNull(inputSurName);
    });

    form.append(groupName);
    form.append(groupSurName);
    form.append(groupLastName);

    if (client) {
      modalTitle.textContent = "Изменить данные";
      clientIdNode.textContent = "id: " + client.id;
      inputName.value = client.name;
      inputSurName.value = client.surname;
      inputLastName.value = client.lastName;
      if (client.contacts) {
        countContacts = displeyContacts(client.contacts, form);
      }
    } else {
      modalTitle.textContent = "Новый клиент";
    }

    const btnAddContact = GetButton(
      "Добавить контакт",
      "./img/add_circle_outline.svg"
    );

    const btnSave = GetButton("Сохранить");
    const btnDeleteContact = GetButton("Удалить клиента");
    btnSave.setAttribute("type", "submit");

    form.append(btnAddContact);
    form.append(btnSave);
    form.append(btnDeleteContact);
    modalContent.append(modalFooter);
    dialog.append(modalContent);
    modalElement.append(dialog);

    btnAddContact.addEventListener("click", () => {
      countContacts += 1;
      const contact = GetInputContact();
      btnAddContact.before(contact);
      if (countContacts >= 3) {
        btnAddContact.style.display = "none";
      }
    });

    btnClose.addEventListener("click", () => {
      onClose(modalElement);
    });

    form.addEventListener("countContacts", () => {
      countContacts -= 1;
      if (countContacts < 3) {
        btnAddContact.style.display = "flex";
      }
    });

    form.addEventListener("submit", (e) => {
      let isValidName = ValidFieldsNull(inputName);
      let isValidSurName = ValidFieldsNull(inputSurName);
      let isValidContacts = ValidFieldsContacts();
      if (!isValidContacts || !isValidName || !isValidSurName) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      form.classList.add("was-validated");
      const formData = SaveServerClient();
      if (client) {
        formData.id = client.id;
      }
      onSave(formData, modalElement);
    });

    return modalElement;
  }

  function displeyContacts(contacts, tag) {
    let count = 0;
    contacts.forEach((c) => {
      const contact = Object.entries(c);
      tag.append(GetInputContact(c));
      count += 1;
    });
    return count;
  }

  function ValidFieldsContacts() {
    let isStateValid = true;
    const arrayClient = document.querySelectorAll("form > div > input");
    if (arrayClient.length <= 3) return true;
    arrayClient.forEach((field) => {
      if (!ValidFieldContact(field)) {
        isStateValid = false;
      }
    });
    return isStateValid;
  }

  function ValidFieldContact(field) {
    let valid = true;
    switch (field.getAttribute("name")) {
      case "Vk":
      case "Facebook":
      case "Email":
        if (!ValidFieldEmailAndUrl(field)) {
          valid = false;
        }
        break;
      case "Other":
        if (!ValidFieldOther(field)) {
          valid = false;
        }
        break;
      case "Телефон":
        if (!ValidFieldTel(field)) {
          valid = false;
        }
        break;
      default:
        break;
    }
    return valid;
  }

  function ValidFieldEmailAndUrl(field) {
    if (field.value === "") {
      field.classList.add("is-invalid");
      $(field).siblings("div").html("поле не может быть пустым");
      return false;
    } else if (field.validity.typeMismatch) {
      if (field.getAttribute("name") === "Email") {
        $(field).siblings("div").html("Введите корректный email");
      } else {
        $(field).siblings("div").html("Введите корректный URL");
      }
      field.classList.add("is-invalid");
      return false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      return true;
    }
  }

  function ValidFieldTel(field) {
    if (field.value === "") {
      field.classList.add("is-invalid");
      $(field).siblings("div").html("поле не может быть пустым");
      return false;
    } else if (field.validity.patternMismatch) {
      $(field)
        .siblings("div")
        .html("номер телефона должен состоять из 11 символов");
      field.classList.add("is-invalid");
      return false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      return true;
    }
  }

  function ValidFieldOther(field) {
    if (field.value === "") {
      $(field).siblings("div").html("поле не может быть пустым");
      field.classList.add("is-invalid");
      return false;
    } else if (field.validity.tooShort) {
      $(field).siblings("div").html("поле не может быть меньше 20 символов");
      field.classList.add("is-invalid");
      return false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      return true;
    }
  }

  async function GetClientsFromServer() {
    const response = await fetch("http://localhost:3000/api/clients");
    const clients = await response.json();
    return clients;
  }

  async function AddClientToServer(client) {
    const res = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      body: JSON.stringify(client),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  }

  async function EditingClientToServer(client) {
    const res = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: client.name,
        surname: client.surname,
        lastName: client.lastName,
        contacts: client.contacts,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  }

  async function DeleteClientFromServer(clientId) {
    const res = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
      method: "DELETE",
    });
    return res;
  }

  async function GetClientFromServerID(clientId) {
    const response = await fetch(
      `http://localhost:3000/api/clients/${clientId}`,
      {
        method: "GET",
      }
    );
    const client = await response.json();
    return client;
  }

  async function onSave(formData, modalElement) {
    if (formData.id) {
      const res = await EditingClientToServer(formData);
      if (!res.ok) {
        return;
      }
    } else {
      const res = await AddClientToServer(formData);
      if (!res.ok) {
        return;
      }
      modalElement.remove();
      createBodyTable();
    }
  }

  function onClose(modalElement) {
    modalElement.remove();
  }

  function getRangeTd() {
    const range = document.createElement("td");
    range.classList.add("table__range");
    return range;
  }

  function GetButton(text, imgUrl) {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn__custom");
    btn.setAttribute("type", "button");
    btn.textContent = text;
    if (imgUrl) {
      const img = document.createElement("img");
      img.setAttribute("src", imgUrl);
      img.classList.add("btn__icon");
      btn.append(img);
    }
    return btn;
  }

  function GetGroupInput(formInput, prop) {
    const formGroup = document.createElement("div");
    const formLabel = document.createElement("label");

    formGroup.classList.add("form-group", "form__input--group");
    formLabel.classList.add("col-form-label", "form__label", "p-0");
    formLabel.setAttribute("for", prop);
    formInput.setAttribute("id", prop);
    formInput.setAttribute("name", prop);
    formInput.setAttribute("type", "text");
    formInput.classList.add("form-control", "form__input--text", "p-0");
    formGroup.append(formLabel);
    formGroup.append(formInput);
    switch (prop) {
      case "surname":
        formLabel.textContent = "Фамилия*";
        break;
      case "name":
        formLabel.textContent = "Имя*";
        break;
      case "lastName":
        formLabel.textContent = "Отчество";
        break;
      default:
        break;
    }
    return formGroup;
  }

  function AddValidField(message) {
    const validField = document.createElement("div");
    validField.classList.add("invalid-feedback");
    validField.textContent = message;
    return validField;
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

  function GetFullName(clientObj) {
    let fullName =
      clientObj.surname.trim() +
      " " +
      clientObj.name.trim() +
      " " +
      clientObj.lastName.trim();
    return fullName;
  }

  function GetDate(formatDate) {
    const formatedDate = document.createElement("span");
    formatedDate.classList.add("table__date");
    let result =
      formatDate.getDate() +
      "." +
      (formatDate.getMonth() + 1) +
      "." +
      formatDate.getFullYear();

    formatedDate.textContent = result.trim();
    return formatedDate;
  }

  function GetTime(formatDate) {
    const formatedTime = document.createElement("span");
    formatedTime.classList.add("table__time");
    formatedTime.textContent =
      formatDate.getHours() + ":" + formatDate.getMinutes();
    return formatedTime;
  }

  function GetContacts(array) {
    const contacts = document.createElement("td");
    const imgGroup = document.createElement("div");

    imgGroup.classList.add("btn-group");
    array.forEach((element) => {
      const btnContact = document.createElement("button");
      btnContact.classList.add("btn", "p-0", "btn__tooltip");
      btnContact.setAttribute("type", "button");
      btnContact.setAttribute("data-placement", "top");
      btnContact.setAttribute("data-toggle", "tooltip");
      const img = document.createElement("img");
      btnContact.setAttribute("title", element.type + ": " + element.value);
      switch (element.type) {
        case "Facebook":
          img.setAttribute("src", "./img/fb.svg");
          break;
        case "Vk":
          img.setAttribute("src", "./img/vk.svg");
          break;
        case "Телефон":
          img.setAttribute("src", "./img/phone.svg");
          break;
        case "Email":
          img.setAttribute("src", "./img/mail.svg");
          break;
        case "Other":
          img.setAttribute("src", "./img/Subtract.svg");
          break;

        default:
          break;
      }
      img.classList.add("clients__img");
      btnContact.addEventListener("mouseover", (e) => {
        e.preventDefault();
        $(btnContact).tooltip("show");
      });
      btnContact.addEventListener("mouseout", (e) => {
        e.preventDefault();
        $(btnContact).tooltip("hide");
      });
      btnContact.append(img);
      imgGroup.append(btnContact);
    });

    contacts.append(imgGroup);
    return contacts;
  }

  function GetInputContact(contact) {
    const typeContacts = ["Телефон", "Email", "Vk", "Facebook", "Другое"];
    const formGroup = document.createElement("div");
    const formGroupAppend = document.createElement("div");
    const formselect = document.createElement("select");
    const formInput = document.createElement("input");

    formGroup.classList.add("form-group", "form__input--group");
    formGroupAppend.classList.add("form-group-append");
    formselect.classList.add("custom-select");
    formselect.setAttribute("id", "select");
    formInput.setAttribute("required", "required");
    formInput.setAttribute("placeholder", "Введите данные контакты");
    formInput.classList.add("form-control", "form-control__contact");

    typeContacts.forEach((el) => {
      const option = document.createElement("option");
      option.setAttribute("value", el);
      option.text = el;
      formselect.append(option);
    });

    let selectedOptions = "";

    formselect.addEventListener("change", () => {
      selectedOptions = formselect.options[formselect.selectedIndex];
      addType(selectedOptions.text);
    });

    let validField = null;

    function addType(prop) {
      switch (prop) {
        case "Телефон":
          formInput.setAttribute("type", "tel");
          formInput.setAttribute("name", "Телефон");
          formInput.setAttribute("pattern", "[0-9]{11}");
          break;
        case "Email":
          formInput.setAttribute("type", "Email");
          formInput.setAttribute("name", "Email");
          break;
        case "Vk":
          formInput.setAttribute("type", "url");
          formInput.setAttribute("name", "Vk");
          break;
        case "Facebook":
          formInput.setAttribute("type", "url");
          formInput.setAttribute("name", "Facebook");
          break;
        case "Другое":
          formInput.setAttribute("type", "text");
          formInput.setAttribute("name", "Other");
          formInput.setAttribute("minlength", "20");
          break;
        default:
          break;
      }
    }
    formInput.setAttribute("required", "required");
    validField = AddValidField("Поле не может быть пустым!");

    formGroup.append(formselect);
    formInput.setAttribute("aria-describedby", selectedOptions.text);

    formInput.addEventListener("blur", () => {
      if (ValidFieldContact(formInput)) {
        AddButtonDeleteContact(formInput);
      }
    });

    formGroup.append(formInput);
    formGroup.append(validField);
    if (contact) {
      formselect.value = contact.type;
      addType(contact.type);
      formInput.value = contact.value;
      AddButtonDeleteContact(formInput);
    } else {
      selectedOptions = formselect.options[formselect.selectedIndex];
      addType(selectedOptions.text);
    }

    return formGroup;
  }

  function AddButtonDeleteContact(tag) {
    const next = $(tag).next();
    if ($(next).is("div")) {
      const groupAppend = document.createElement("div");
      const btn = document.createElement("button");

      groupAppend.classList.add("input-group-append");
      btn.classList.add("btn", "btn-outline-secondary");
      btn.setAttribute("type", "button");
      btn.innerHTML = "&#215";
      btn.addEventListener("click", () => {
        const parent = $(tag).parent();
        let event = new Event("countContacts", { bubbles: true });
        tag.dispatchEvent(event);
        parent.remove();
      });
      groupAppend.append(btn);
      tag.after(btn);
    }
  }

  function SaveServerClient(id) {
    const arrayClient = document.querySelectorAll("form > div > input");
    const clientForm = {};

    clientForm.contacts = [];
    arrayClient.forEach((field) => {
      switch (field.getAttribute("name")) {
        case "name":
          clientForm.name = field.value;
          break;
        case "surname":
          clientForm.surname = field.value;
          break;
        case "lastName":
          clientForm.lastName = field.value;
          break;
        case "Email":
          clientForm.contacts.push({ type: "Email", value: field.value });
          break;
        case "Vk":
          clientForm.contacts.push({ type: "Vk", value: field.value });
          break;
        case "Other":
          clientForm.contacts.push({ type: "Other", value: field.value });
          break;
        case "Facebook":
          clientForm.contacts.push({ type: "Facebook", value: field.value });
          break;
        case "Телефон":
          clientForm.contacts.push({ type: "Телефон", value: field.value });
          break;

        default:
          break;
      }
    });
    return clientForm;
  }

  function Sortingclients(arr, prop, dir = false) {
    return arr.sort((a, b) =>
      dir ? a[prop] < b[prop] : a[prop] > b[prop] ? 1 : -1
    );
  }

  // function Sortingclients(arr, prop, dir = false) {
  //   return arr.sort((a, b) => (a[prop] < b[prop] ? 1 : -1));
  // }

  RenderApp();
})();
