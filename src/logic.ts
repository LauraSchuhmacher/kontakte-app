import { Contacts } from "@capawesome-team/capacitor-contacts";
import { ref } from "vue";
import { addIcons } from "ionicons";
import { Clipboard } from "@capacitor/clipboard";
import {
  arrowBackOutline,
  addOutline,
  atOutline,
  balloonOutline,
  callOutline,
  createOutline,
  reloadOutline,
  trashOutline,
  copyOutline,
} from "ionicons/icons";

addIcons({
  "add-outline": addOutline,
  "reload-outline": reloadOutline,
  "call-outline": callOutline,
  "at-outline": atOutline,
  "balloon-outline": balloonOutline,
  "trash-outline": trashOutline,
  "create-outline": createOutline,
  "arrow-back-outline": arrowBackOutline,
  "copy-outline": copyOutline,
});

export const contacts = ref<any[]>([]);
export const showDetail = ref(false);
export const showCreateModal = ref(false);
export const selectedContact = ref<any | null>(null);
export const groupedContacts = ref<{ [letter: string]: any[] }>({});
export const sortedLetters = ref<string[]>([]);
export const totalContacts = ref<number | null>(null);

export const newContact = ref({
  givenName: "",
  familyName: "",
  phoneNumber: "",
  email: "",
  birthday: "",
});

export const getContacts = async () => {
  const { contacts: result } = await Contacts.getContacts({
    limit: 10,
    offset: 0,
  });

  contacts.value = result.sort((a, b) => {
    if (!a.givenName) return 1;
    if (!b.givenName) return -1;
    return a.givenName.localeCompare(b.givenName);
  });

  const groups: { [letter: string]: any[] } = {};

  contacts.value.forEach((contact) => {
    const firstLetter = (
      contact.givenName?.[0] ||
      contact.familyName?.[0] ||
      "#"
    ).toUpperCase();

    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }

    groups[firstLetter].push(contact);

    const sorted = Object.keys(groups).sort();

    sorted.forEach((letter) => {
      groups[letter].sort((a, b) => {
        const nameA = `${a.givenName ?? ""} ${
          a.familyName ?? ""
        }`.toLowerCase();
        const nameB = `${b.givenName ?? ""} ${
          b.familyName ?? ""
        }`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });

    groupedContacts.value = groups;
    sortedLetters.value = sorted;
  });
};

export const countContacts = async () => {
  const { total } = await Contacts.countContacts();
  totalContacts.value = total;
};

export const openDetail = (contact: any) => {
  selectedContact.value = contact;
  showDetail.value = true;
};

export const closeDetail = () => {
  showDetail.value = false;
  selectedContact.value = null;
};

export const closeCreateModal = () => {
  showCreateModal.value = false;
  newContact.value = {
    givenName: "",
    familyName: "",
    phoneNumber: "",
    email: "",
    birthday: "",
  };
};

export const confirmAndDeleteContact = async () => {
  if (!selectedContact.value?.id) return;
  const confirmed = window.confirm(
    "Möchtest du diesen Kontakt wirklich löschen?"
  );
  if (confirmed) {
    await deleteContactById(selectedContact.value.id);
    closeDetail();
  }
};

export const saveNewContact = async () => {
  const contact = {
    givenName: newContact.value.givenName,
    familyName: newContact.value.familyName,
    phoneNumbers: newContact.value.phoneNumber
      ? [{ value: newContact.value.phoneNumber }]
      : [],
    emailAddresses: newContact.value.email
      ? [{ value: newContact.value.email }]
      : [],
    birthday: newContact.value.birthday
      ? {
          year: new Date(newContact.value.birthday).getFullYear(),
          month: new Date(newContact.value.birthday).getMonth() + 1,
          day: new Date(newContact.value.birthday).getDate(),
        }
      : undefined,
  };
  await Contacts.createContact({ contact });
  closeCreateModal();
  await getContacts();
  await countContacts();
};

export const deleteContactById = async (contactId: string) => {
  await Contacts.deleteContactById({ id: contactId });
  await getContacts();
  await countContacts();
};
export const copyToClipboard = async (text: string) => {
  await Clipboard.write({ string: text });
  alert("In die Zwischenablage kopiert: " + text);
};

export const callNumber = (number: string) => {
  window.location.href = `tel:${number}`;
};

export const writeMail = (email: string) => {
  window.location.href = `mailto:${email}`;
};

export const updateContact = async () => {};

export const createContact = async () => {
  const status = await Contacts.requestPermissions();
  if (status.writeContacts === "granted") showCreateModal.value = true;
};

export const requestPermissions = async () => {
  const status = await Contacts.requestPermissions();
  if (status.readContacts === "granted") {
    await getContacts();
    await countContacts();
  } else {
  }
};
