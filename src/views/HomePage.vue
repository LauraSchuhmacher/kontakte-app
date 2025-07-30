<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="display: flex; align-items: center;">
          <img :src="myIcon" alt="Icon" style="height: 24px; width: 24px; margin-right: 8px; border-radius: 50%;" />
          Kontakte
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Kontakte</ion-title>
          <p v-if="totalContacts !== null">{{ totalContacts }}</p>
        </ion-toolbar>
      </ion-header>
      <ion-button @click="getContacts()" fill="outline" aria-label="Reload">
        <ion-icon name="reload-outline" aria-hidden="true"></ion-icon></ion-button>
      <!-- page 145 -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="createContact()" aria-label="Add">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-list v-if="Object.keys(groupedContacts).length > 0">
        <div v-for="letter in sortedLetters" :key="letter">
          <ion-item-divider color="light">
            <ion-label>{{ letter }}</ion-label>
          </ion-item-divider>
          <ion-item
            v-for="contact in groupedContacts[letter]"
            :key="contact.id"
            @click="openDetail(contact)"
          >
            <ion-label>
              {{ contact.givenName }} {{ contact.familyName }}
            </ion-label>
          </ion-item>
        </div>
      </ion-list>      
     
     <ion-modal :is-open="showDetail" @didDismiss="closeDetail()">
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="closeDetail()" fill="clear" aria-label="Zurück">
          <ion-icon name="arrow-back-outline"></ion-icon>
        </ion-button>
        <ion-title>Kontakt Details</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-card v-if="selectedContact">
      <ion-card-header>
        <ion-card-title>
          {{ selectedContact.givenName }} {{ selectedContact.familyName }}
        </ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-item v-if="selectedContact.phoneNumbers?.length">
          <ion-icon slot="start" name="call-outline"></ion-icon>
          <ion-label @click="callNumber(selectedContact.phoneNumbers[0].value)" style="cursor: pointer; color: var(--ion-color-primary)">
            {{ selectedContact.phoneNumbers[0].value }}
          </ion-label>
          <ion-button slot="end" fill="clear" color="medium" @click="copyToClipboard(selectedContact.phoneNumbers[0].value)">
            <ion-icon name="copy-outline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item v-if="selectedContact.emailAddresses?.length">
          <ion-icon slot="start" name="at-outline"></ion-icon>
          <ion-label @click="writeMail(selectedContact.emailAddresses[0].value)" style="cursor: pointer; color: var(--ion-color-primary)">
            {{ selectedContact.emailAddresses[0].value }}
          </ion-label>
          <ion-button slot="end" fill="clear" color="medium" @click="copyToClipboard(selectedContact.emailAddresses[0].value)">
            <ion-icon name="copy-outline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item v-if="selectedContact.birthday">
          <ion-icon slot="start" name="balloon-outline"></ion-icon>
          <ion-label>
            {{ selectedContact.birthday.day }}.{{ selectedContact.birthday.month }}.{{ selectedContact.birthday.year }}
          </ion-label>
        </ion-item>
      </ion-card-content>
    </ion-card>

    <div class="ion-text-center">
      <ion-button color="danger" @click="confirmAndDeleteContact()">
        <ion-icon slot="start" name="trash-outline"></ion-icon>
        Löschen
      </ion-button>

      <ion-button color="primary" @click="updateContact()">
        <ion-icon slot="start" name="create-outline"></ion-icon>
        Bearbeiten
      </ion-button>
    </div>
  </ion-content>
</ion-modal>



      <ion-modal :is-open="showCreateModal" @didDismiss="closeCreateModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Neuen Kontakt erstellen</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeCreateModal()">Abbrechen</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Vorname</ion-label>
            <ion-input v-model="newContact.givenName" placeholder="Max"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Nachname</ion-label>
            <ion-input v-model="newContact.familyName" placeholder="Mustermann"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Telefonnummer</ion-label>
            <ion-input v-model="newContact.phoneNumber" type="tel"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">E-Mail</ion-label>
            <ion-input v-model="newContact.email" type="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Geburtstag</ion-label>
            <ion-datetime v-model="newContact.birthday" presentation="date"></ion-datetime>
          </ion-item>
          <ion-button expand="block" @click="saveNewContact()">Speichern</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonDatetime,
  IonInput,
  IonItemDivider,
  IonFab,
  IonFabButton,
} from "@ionic/vue";
import { Contacts } from "@capawesome-team/capacitor-contacts";
import { ref, onMounted } from "vue";
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
import myIcon from '@/assets/favicon.png';


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

onMounted(() => {
  requestPermissions();
  // getContacts();
  // countContacts();
});

const contacts = ref<any[]>([]);
const showDetail = ref(false);
const showCreateModal = ref(false);
const selectedContact = ref<any | null>(null);
const groupedContacts = ref<{ [letter: string]: any[] }>({});
const sortedLetters = ref<string[]>([]);
const totalContacts = ref<number | null>(null);

const newContact = ref({
  givenName: "",
  familyName: "",
  phoneNumber: "",
  email: "",
  birthday: "",
});

const getContacts = async () => {
  const { contacts: result } = await Contacts.getContacts({
    limit: 10,
    offset: 0,
  });

  contacts.value = result.sort((a, b) => {
    if (!a.givenName) return 1;
    if (!b.givenName) return -1;
    return a.givenName.localeCompare(b.givenName);
  });
  console.log(contacts);

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

const countContacts = async () => {
  const { total } = await Contacts.countContacts();
  totalContacts.value = total;
};

const openDetail = (contact: any) => {
  selectedContact.value = contact;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  selectedContact.value = null;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  newContact.value = {
    givenName: "",
    familyName: "",
    phoneNumber: "",
    email: "",
    birthday: "",
    };
  };

const confirmAndDeleteContact = async () => {
  if (!selectedContact.value?.id) return;
  const confirmed = window.confirm(
    "Möchtest du diesen Kontakt wirklich löschen?"
  );
  if (confirmed) {
    await deleteContactById(selectedContact.value.id);
    closeDetail();
  }
};

const saveNewContact = async () => {
  const contact = {
    givenName: newContact.value.givenName,
    familyName: newContact.value.familyName,
    phoneNumbers: newContact.value.phoneNumber ? [{ value: newContact.value.phoneNumber }] : [],
    emailAddresses: newContact.value.email ? [{ value: newContact.value.email }] : [],
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

const deleteContactById = async (contactId: string) => {
  await Contacts.deleteContactById({ id: contactId });
  await getContacts();
  await countContacts();
};
const copyToClipboard = async (text: string) => {
  await Clipboard.write({ string: text });
  alert("In die Zwischenablage kopiert: " + text);
};

const callNumber = (number: string) => {
  window.location.href = `tel:${number}`;
}

const writeMail = (email: string) => {
  window.location.href = `mailto:${email}`;
}

const updateContact = async () => {};

const createContact = () => {
  showCreateModal.value = true;
};

const requestPermissions = async () => {
  const status = (await Contacts.requestPermissions()) as { granted: boolean };
  if (status.granted) {
    await getContacts();
    await countContacts();
  } else {
    console.warn("Keine Berechtigung für Kontakte");
  }
};
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
