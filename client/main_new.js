(async function () {
  function createHeaderTable() {
    const btnAddClient = document.querySelector(".clients__btn");
    btnAddClient.addEventListener("click", () => {
      const modal = createModalWithForm(null, { onSave, onClose });
      document.body.append(modal);
      $("#my").on("hidden.bs.modal", () => {
        onClose(modal);
      });
      $("#my").modal("show");
    });
  }

  async function createBodyTable() {
    const listClients = await GetClientsFromServer();
    const table = document.querySelector("thead");
    const tBody = document.createElement("tbody");
    tBody.classList.add("table__content");
    if (listClients) {
      for (const client of listClients) {
        tBody.append(createRowTable(client));
      }
    }
    table.after(tBody);
  }

  function createRowTable(clientObj) {
    const row = document.createElement("tr");
    row.classList.add("table__row");
    const id = document.createElement("th");
    id.classList.add("table__clientId");
    const fullName = getRangeTd();
    const actions = getRangeTd();

    const buttonGroup = document.createElement("div");
    const editButton = GetButton("Редактировать", "./img/edit.svg");
    const deleteButton = GetButton("Удалить", "./img/cancel.svg");
    buttonGroup.classList.add("btn-group", "btn-group");
    buttonGroup.append(editButton);
    buttonGroup.append(deleteButton);
    actions.append(buttonGroup);

    id.setAttribute("scope", "row");
    id.textContent = clientObj.id;
    row.append(id);
    fullName.textContent = GetFullName(clientObj);
    const contacts = GetContacts(clientObj.contacts);
    row.append(fullName);
    row.append(GetDate(clientObj.createdAt));
    row.append(GetTime(clientObj.createdAt));
    row.append(GetDate(clientObj.updatedAt));
    row.append(GetTime(clientObj.updatedAt));
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

    modalElement.setAttribute("id", "my");
    modalElement.classList.add("modal", "fade");
    dialog.classList.add("modal-dialog");
    modalContent.classList.add("modal-content", "modal-body", "p-0");
    modalHeader.classList.add("modal-header", "modal__header");
    modalTitle.classList.add("modal-title", "modal__title");
    clientIdNode.classList.add("modal__id");
    btnClose.setAttribute("type", "button");
    btnClose.setAttribute("data-dismiss", "modal");
    btnClose.setAttribute("aria-label", "Close");
    btnClose.classList.add("close");
    iconBtn.setAttribute("aria-hidden", "true");
    iconBtn.innerHTML = "&#215";
    btnClose.append(iconBtn);

    form.classList.add("needs-validation");
    form.setAttribute("novalidate", "true");
    modalContent.classList.add("modal__form");
    modalHeader.append(modalTitle);
    modalHeader.append(clientIdNode);
    modalHeader.append(btnClose);
    modalContent.append(modalHeader);

    modalBody.append(form);
    modalContent.append(modalBody);
    const modalFooter = document.createElement("div");
    modalFooter.classList.add(
      "modal-footer",
      "d-flex",
      "flex-column",
      "justify-content-center"
    );

    if (client) {
      modalTitle.textContent = "Изменить данные";
      clientIdNode.textContent = "id: " + client.id;
      form.append(GetInput("name", client.name));
      form.append(GetInput("lastName", client.lastName));
      form.append(GetInput("surname", client.surname));
      if (client.contacts) {
        displeyContacts(client.contacts, form);
      }
    } else {
      modalTitle.textContent = "Новый клиент";
      form.append(GetInput("name"));
      form.append(GetInput("lastName"));
      form.append(GetInput("surname"));
    }

    const btnAddContact = GetButton(
      "Добавить контакт",
      "./img/add_circle_outline.svg"
    );

    form.append(btnAddContact);
    const btnSave = GetButton("Сохранить");
    btnSave.setAttribute("type", "submit");
    const btnDeleteContact = GetButton("Удалить клиента");
    form.append(btnSave);
    form.append(btnDeleteContact);
    modalContent.append(modalFooter);
    dialog.append(modalContent);
    modalElement.append(dialog);

    btnAddContact.addEventListener("click", () => {
      form.append(GetInputContact());
    });

    btnClose.addEventListener("click", () => {
      onClose(modalElement);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // let isValidName = ValidFieldsNull(inputName);
      // let isValidSurName = ValidFieldsNull(inputSurName);
      const formData = SaveServerClient();
      if (client) {
        formData.id = client.id;
      }
      onSave(formData, modalElement);
    });

    return modalElement;
  }

  function displeyContacts(contacts, tag) {
    contacts.forEach((c) => {
      const contact = Object.entries(c);
      tag.append(GetInputContact(c));
    });
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

  function GetInput(prop, value) {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group", "form__input--group");
    const formLabel = document.createElement("label");
    formLabel.classList.add("col-form-label", "form__label", "p-0");
    const formInput = document.createElement("input");
    formInput.setAttribute("id", prop);
    formInput.setAttribute("name", prop);
    formInput.setAttribute("type", "text");
    formLabel.setAttribute("for", prop);
    formInput.classList.add("form-control", "form__input--text", "p-0");
    switch (prop) {
      case "surname":
        formLabel.textContent = "Фамилия*";
        const validSurName = document.createElement("div");
        validSurName.classList.add("invalid-feedback");
        validSurName.textContent = "Поле не может быть пустым!";
        formGroup.append(validSurName);
        formInput.setAttribute("required", "true");
        formInput.addEventListener("blur", () => {
          ValidFieldsNull(formInput);
        });
        break;
      case "name":
        formLabel.textContent = "Имя*";
        const validName = document.createElement("div");
        validName.classList.add("invalid-feedback");
        validName.textContent = "Поле не может быть пустым!";
        formGroup.append(validName);
        formInput.setAttribute("required", "true");
        formInput.addEventListener("blur", () => {
          ValidFieldsNull(formInput);
        });
        break;
      case "lastName":
        formLabel.textContent = "Отчество";
        break;

      default:
        break;
    }

    if (value) {
      formInput.value = value;
    }
    formGroup.append(formLabel);
    formGroup.append(formInput);

    return formGroup;
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

  function GetDate(date) {
    const formatedDate = getRangeTd();
    formatedDate.classList.add("table__date");
    let formatDate = new Date(date);
    let result =
      formatDate.getDate() +
      "." +
      formatDate.getMonth() +
      "." +
      formatDate.getFullYear();

    formatedDate.textContent = result.trim();
    return formatedDate;
  }

  function GetTime(date) {
    const formatedTime = getRangeTd();
    let formatDate = new Date(date);
    formatedTime.classList.add("table__time");
    formatedTime.textContent =
      formatDate.getMinutes() + ":" + formatDate.getHours();
    return formatedTime;
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

  function GetInputContact(contact) {
    const typeContacts = ["Телефон", "Email", "Vk", "Facebook", "Другое"];

    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const formGroupAppend = document.createElement("div");
    formGroupAppend.classList.add("form-group-append");

    const formselect = document.createElement("select");
    formselect.classList.add("custom-select");
    formselect.setAttribute("id", "select");

    const formInput = document.createElement("input");
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

    function addType(prop) {
      switch (prop) {
        case "Телефон":
          formInput.setAttribute("type", "tel");
          formInput.setAttribute("name", "tel");
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
          break;
        default:
          break;
      }
    }

    formGroup.append(formselect);
    formInput.setAttribute("aria-describedby", selectedOptions.text);
    formGroup.append(formInput);

    if (contact) {
      formselect.value = contact.type;
      addType(contact.type);
      formInput.value = contact.value;
      AddButtonDeleteContact(formGroup);
    }

    return formGroup;
  }

  function AddButtonDeleteContact(tag) {
    const groupAppend = document.createElement("div");
    groupAppend.classList.add("input-group-append");
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-outline-secondary");
    btn.setAttribute("type", "button");
    btn.innerHTML = "&#215";
    groupAppend.append(btn);
    tag.append(btn);
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
        case "'Телефон'":
          clientForm.contacts.push({ type: "Телефон", value: field.value });
          break;

        default:
          break;
      }
    });
    return clientForm;
  }
  createHeaderTable();
  createBodyTable();
})();
