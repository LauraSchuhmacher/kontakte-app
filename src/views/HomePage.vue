<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Kontakte</ion-title>
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
              <ion-button @click="closeDetail()" fill="clear" aria-label="Back">
                <ion-icon name="arrow-back-outline"></ion-icon>
              </ion-button>
              <span
                style="
                  vertical-align: middle;
                  font-size: 1.1em;
                  font-weight: 500;
                  margin-left: 8px;
                "
              >Kontakt Details</span>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div v-if="selectedContact">
            <p>
              {{ selectedContact.givenName }} {{ selectedContact.familyName }}
            </p>
            <p v-if="selectedContact.phoneNumbers?.length">
              <ion-icon name="call-outline"></ion-icon>
              <span
                style="cursor: pointer; color: var(--ion-color-primary)"
                @click="copyToClipboard(selectedContact.phoneNumbers[0].value)"
              >
                {{ selectedContact.phoneNumbers[0].value }}
              </span>
            </p>
            <p v-if="selectedContact.emailAddresses?.length">
              <ion-icon name="at-outline"></ion-icon>
              <span
                style="cursor: pointer; color: var(--ion-color-primary)"
                @click="copyToClipboard(selectedContact.emailAddresses[0].value)"
              >
              {{ selectedContact.emailAddresses[0].value }}
              </span>
            </p>
            <p v-if="selectedContact.birthday">
              <ion-icon name="balloon-outline"></ion-icon>
              {{ selectedContact.birthday.day }}.{{
                selectedContact.birthday.month
              }}.{{ selectedContact.birthday.year }}
            </p>
          </div>
          <ion-button @click="confirmAndDeleteContact()">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
          <ion-button @click="updateContact()">
            <ion-icon name="create-outline"></ion-icon>
          </ion-button>
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
});

onMounted(() => {
  requestPermissions();
  // getContacts();
  // countContacts();
});

const contacts = ref<any[]>([]);
const showDetail = ref(false);
const selectedContact = ref<any | null>(null);
const groupedContacts = ref<{ [letter: string]: any[] }>({});
const sortedLetters = ref<string[]>([]);
const totalContacts = ref<number | null>(null);

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

const deleteContactById = async (contactId: string) => {
  await Contacts.deleteContactById({ id: contactId });
  await getContacts();
  await countContacts();
};
const copyToClipboard = async (text: string) => {
  await Clipboard.write({ string: text });
  alert("In die Zwischenablage kopiert: " + text);
};

const updateContact = async () => {};

const createContact = async () => {};

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
