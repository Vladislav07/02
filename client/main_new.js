(async function () {
  function RenderApp() {
    const body = document.querySelector("body");
    body.append(createHeader());
    body.append(createMainSection());
    LoadData();
  }

  async function LoadData() {
    const listClients = await GetClientsFromServer();
    setTimeout(() => {
      createBodyTable(listClients);
    }, 1000);
    waitingDownload();
  }

  function waitingDownload() {
    const table = document.querySelector("table");
    const wrapper = document.createElement("div");
    const spinner = document.createElement("div");
    wrapper.classList.add(
      "d-flex",
      "justify-content-center",
      "table__spinner--wrapper"
    );
    spinner.classList.add("spinner-border", "table__spinner");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("currentColor", "#9873FF");
    wrapper.append(spinner);
    table.after(wrapper);

    table.addEventListener("loaded", () => {
      wrapper.remove();
    });
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

    inputSearsh.addEventListener("change", () => {
      const timerId = setTimeout(displeyClientsSearsh(inputSearsh.value), 300);
      clearTimeout(timerId);
    });

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
    table.classList.add("table__clients");
    thId.append(createImgHeader("идентификатор", "numberId"));
    const thName = createTh("Фамилия Имя Отчество");
    thName.append(
      createImgHeader("фамилия, имя, отчество", "fullName", "./img/а-я.svg")
    );
    const thDateCreated = createTh("Дата и время создания");
    thDateCreated.classList.add("table__header--date");
    thDateCreated.append(createImgHeader("Дата создания", "dateCreated"));

    const thDateUpdated = createTh("Последние изменения");
    thDateUpdated.append(createImgHeader("Последнее изменение", "dateUpdated"));
    thDateUpdated.classList.add("table__header--date");

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
      AddClient();
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
      sortDirection = !sortDirection;
      imgHeader.classList.toggle("table__sort--toggle");
      imgHeader.dispatchEvent(
        new CustomEvent("Sort", {
          detail: { column: prop, dir: sortDirection },
          bubbles: true,
        })
      );
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

  function createBodyTable(listClients) {
    const formatedData = FormatingData(listClients);
    const table = document.querySelector("thead");
    const tBody = document.createElement("tbody");
    tBody.classList.add("table__content");

    const eventLoaded = new CustomEvent("loaded", {
      bubbles: true,
    });

    table.dispatchEvent(eventLoaded);
    renderRow(formatedData);
    table.addEventListener("Sort", (e) => {
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
    const editButton = GetButton("Редактировать");
    const deleteButton = GetButton("Удалить");
    const dateCreated = getRangeTd();
    const dateUpdated = getRangeTd();

    editButton.classList.add("table__btn", "table__btn--edit");
    deleteButton.classList.add("table__btn", "table__btn--delete");

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
      EditClient(clientObj.id);
    });

    deleteButton.addEventListener("click", function () {
      DeleteClient(clientObj.id);
    });

    return row;
  }

  function DeleteClient(clientId) {
    const modal = createContentModalDelete("del", clientId);
    document.body.append(modal);
    $("#del").on("hidden.bs.modal", () => {
      onClose(modal);
    });
    $("#del").modal("show");
  }

  async function EditClient(clientId) {
    const client = await GetClientFromServerID(clientId);
    const modal = createContentModal("edit", client);
    document.body.append(modal);
    $("#edit").on("hidden.bs.modal", () => {
      onClose(modal);
    });
    $("#edit").modal("show");
  }

  function AddClient() {
    const modal = createContentModal("adding");
    document.body.append(modal);
    $("#adding").on("hidden.bs.modal", () => {
      onClose(modal);
    });
    $("#adding").modal("show");
  }

  function createContentModal(idModal, client = null) {
    const modalBody = document.createElement("div");
    const form = document.createElement("form");
    const inputName = document.createElement("input");
    const inputSurName = document.createElement("input");
    const inputLastName = document.createElement("input");
    let countContacts = 0;

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
    modalBody.append(form);
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
      inputName.value = client.name;
      inputSurName.value = client.surname;
      inputLastName.value = client.lastName;
      if (client.contacts) {
        countContacts = displeyContacts(client.contacts, form);
      }
    }

    const groupContact = document.createElement("div");
    groupContact.classList.add("form-group", "form__group--contact");


    const btnAddContact = GetButton("Добавить контакт");

    btnAddContact.classList.add("modal__btn--addContact");
    groupContact.append(btnAddContact);

    const btnSave = GetButton("Сохранить");
    btnSave.classList.add("btn-primary", "modal__btn--action");
    btnSave.setAttribute("type", "submit");
    form.append(groupContact);
    form.append(btnSave);

    btnAddContact.addEventListener("click", () => {
      countContacts += 1;
      const contact = GetInputContact();
      btnAddContact.before(contact);
      if (countContacts >= 10) {
        btnAddContact.style.display = "none";
      }
    });

    form.addEventListener("countContacts", () => {
      countContacts -= 1;
      if (countContacts < 10) {
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
      onSave(formData, modal);
    });

    let modal = null;

    if (client) {
      modal = createBaseModalForm(
        idModal,
        "Изменить данные",
        modalBody,
        client.id
      );
    } else {
      modal = createBaseModalForm(idModal, "Новый клиент", modalBody);
    }
    return modal;
  }

  function createContentModalDelete(idModal, clientId) {
    const modalBody = document.createElement("div");
    modalBody.classList.add(
      "modal-body",
      "d-flex",
      "flex-column",
      "justify-content-center",
      "modal__content--delete"
    );
    const message = document.createElement("p");
    message.classList.add("modal__message");
    message.textContent = "Вы действительно хотите удалить данного клиента?";
    const btnDelete = document.createElement("button");
    btnDelete.setAttribute("type", "button");
    btnDelete.classList.add("btn", "btn-primary", "modal__btn--delete");
    btnDelete.textContent = "Удалить";

    btnDelete.addEventListener("click", () => {
      DeleteClientFromServer(clientId);
      onClose(modalDelete);
    });

    modalBody.append(message);
    modalBody.append(btnDelete);

    const modalDelete = createBaseModalForm(
      idModal,
      "Удалить клиента",
      modalBody
    );
    return modalDelete;
  }

  function createBaseModalForm(idModal, title, body, clientId) {
    const modalElement = document.createElement("div");
    const dialog = document.createElement("div");
    const modalContent = document.createElement("div");
    const modalHeader = document.createElement("div");
    const modalTitle = document.createElement("h5");
    const btnClose = document.createElement("button");
    const iconBtn = document.createElement("span");
    const modalFooter = document.createElement("div");
    const btnCancel = document.createElement("button");
    const clientIdNode = document.createElement("div");

    modalElement.setAttribute("id", idModal);
    modalElement.classList.add("modal", "fade");
    dialog.classList.add("modal-dialog");
    modalContent.classList.add("modal-content");
    modalHeader.classList.add("modal-header", "modal__header");

    if (title==="Удалить клиента") {
      modalHeader.classList.add("justify-content-center")

    }
    else{
      modalHeader.classList.add("justify-content-start")
    }

    modalTitle.classList.add("modal-title", "modal__title");
    modalTitle.textContent = title;
    modalFooter.classList.add(
      "modal-footer",
      "d-flex",
      "flex-column",
      "justify-content-center"
    );
    clientIdNode.classList.add("modal__id");

    btnClose.setAttribute("type", "button");
    btnClose.setAttribute("data-dismiss", "modal");
    btnClose.setAttribute("aria-label", "Close");
    btnClose.classList.add("close", "modal__btn--close");
    iconBtn.setAttribute("aria-hidden", "true");
    iconBtn.classList.add("modal__icon--close");
    iconBtn.innerHTML = "&#215";
    btnCancel.setAttribute("type", "button");

    btnCancel.classList.add("btn", "modal__btn--cancel");

    modalHeader.append(modalTitle);

    if (clientId) {
      modalHeader.append(clientIdNode);
      clientIdNode.textContent = "id: " + clientId;
      btnCancel.textContent = "Удалить клиента";
      btnCancel.addEventListener("click", () => {
        DeleteClient(clientId);
      });
    } else {
      btnCancel.textContent = "Отмена";
      btnClose.addEventListener("click", () => {
        onClose(modalElement);
      });
    }

    modalHeader.append(btnClose);
    modalContent.append(modalHeader);
    btnClose.append(iconBtn);
    modalContent.append(body);
    modalFooter.append(btnCancel);
    modalContent.append(modalFooter);

    btnCancel.addEventListener("click", () => {
      $(`#${idModal}`).modal("hide");
      onClose(modalElement);
    });

    dialog.append(modalContent);
    modalElement.append(dialog);
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
    try {
      const res = await fetch("http://localhost:3000/api/clients");
      if (res.status == 200) {
        const clients = await res.json();
        return clients;
      } else {
        throw new Error(await errorProcessing(res.status));
      }
    } catch (e) {
      alert(e.message);
    }
  }

  async function GetClientsFromServerSearsh(query) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/clients?search=${query}`
      );
      if (res.status == 200) {
        const clients = await response.json();
        return clients;
      } else {
        throw new Error(await errorProcessing(res.status));
      }
    } catch (e) {
      alert(e.message);
    }
  }

  async function AddClientToServer(client) {
    try {
      const res = await fetch("http://localhost:3000/api/clients", {
        method: "POST1",
        body: JSON.stringify(client),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res === 201) {
        return res;
      } else {
        throw new Error(await errorProcessing(res.status));
      }
    } catch (e) {
      alert(e.message);
    }
  }

  async function EditingClientToServer(client) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/clients/${client.id}`,
        {
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
        }
      );
      if (res === 201) {
        return res;
      } else {
        throw new Error(await errorProcessing(res.status));
      }
    } catch (e) {
      alert(e.message);
    }
  }

  async function DeleteClientFromServer(clientId) {
    try {
      const res = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
        method: "DELETE",
      });
      if (res === 200) {
        return res;
      } else {
        throw new Error(await errorProcessing(res.status));
      }
    } catch (error) {
      alert(e.message);
    }
  }

  async function GetClientFromServerID(clientId) {
    const res = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const client = await res.json();
    return client;
  }

  async function errorProcessing(res) {
    let message = "";
    switch (res) {
      case 404:
        message =
          "переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных";
        break;
      case 422:
        const data = await res.json();
        message = res;
        break;
      case 500:
        message =
          "странно, но сервер сломался :(<br>Обратитесь к куратору Skillbox, чтобы решить проблему";
        break;
      default:
        message = "Что то пошло не так...";
        break;
    }
    return message;
  }

  async function onSave(formData, modalElement) {
    let res = null;
    if (formData.id) {
      res = await EditingClientToServer(formData);
      // if (!res.status === 200) {
      errorProcessing(res);
      return;
      // }
    } else {
      res = await AddClientToServer(formData);
      // if (!res.status === 201) {
      errorProcessing(res);
      return;
      // }
    }
    const listData = await res.json();
    modalElement.remove();
    createBodyTable(listData);
  }

  function onClose(modalElement) {
    modalElement.remove();
  }

  function getRangeTd() {
    const range = document.createElement("td");
    range.classList.add("table__range");
    return range;
  }

  function GetButton(text) {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.setAttribute("type", "button");
    btn.textContent = text;
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

    formGroup.classList.add("form-group", "form__group--empty");
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
    if (prop === "fullName") {
      return arr.sort((a, b) => {
        let nameA = a[prop].toLowerCase();
        let nameB = b[prop].toLowerCase();
        if (dir) {
          return nameA < nameB ? -1 : 1;
        } else {
          return nameB < nameA ? -1 : 1;
        }
      });
    } else {
      return arr.sort((a, b) => (dir ? a[prop] - b[prop] : b[prop] - a[prop]));
    }
  }

  async function displeyClientsSearsh(str) {
    const arr = await GetClientsFromServerSearsh(str);
    if (arr) {
      const tBody = document.querySelector("tBody");
      tBody.remove();
      createBodyTable(arr);
    }
  }

  RenderApp();
})();
