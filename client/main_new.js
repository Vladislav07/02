(async function () {
  function createHeader() {
    const table =document.createElement('table');
    table.classList.add("table", "table-borderless")
  }

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
    const id = document.createElement("th");
    const fullName = getRangeTd();
    const actions = getRangeTd();
    const buttonGroup = document.createElement("div");
    const editButton = GetButton("Редактировать", "./img/edit.svg");
    const deleteButton = GetButton("Удалить", "./img/cancel.svg");

    row.classList.add("table__row");  
    id.classList.add("table__clientId");
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
      countContacts +=1;
      const contact = GetInputContact();
      btnAddContact.before(contact);
      if(countContacts >= 3) {
        btnAddContact.style.display = "none";
      }
    });

    btnClose.addEventListener("click", () => {
      onClose(modalElement);
    });

    form.addEventListener("countContacts", ()=>{
      countContacts -= 1;
      if(countContacts < 3){
        btnAddContact.style.display = 'flex' 
      }

    })

    form.addEventListener("submit", (e) => {
      let isValidName = ValidFieldsNull(inputName);
      let isValidSurName = ValidFieldsNull(inputSurName);
      let isValidContacts=ValidFieldsContacts();
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
    if(arrayClient.length <= 3)return true;
    arrayClient.forEach((field) => {
      if(!ValidFieldContact(field)){
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
      $(field).siblings("div").html("номер телефона должен состоять из 11 символов");
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
      const btnContact = document.createElement("button");
      btnContact.classList.add('btn', "p-0");
      btnContact.setAttribute('type',"button");
      btnContact.setAttribute('data-placement',"top");
      btnContact.setAttribute('data-toggle',"tooltip");
      const img = document.createElement("img");
      btnContact.setAttribute('title',element.type + ': ' + element.value);
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
      btn.addEventListener("click", ()=>{
        const parent = $(tag).parent();
        let event = new Event("countContacts", {bubbles: true});
        tag.dispatchEvent(event);
        parent.remove();
      })
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

  createHeaderTable();
  createBodyTable();
})();

