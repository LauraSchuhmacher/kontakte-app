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
            <p v-if ="totalContacts !== null"> Kontakte : {{ totalContacts }}</p>          
        </ion-toolbar>
      </ion-header>
      <ion-button @click="getContacts()" fill="outline" aria-label="Reload">
        <ion-icon name="reload-outline" aria-hidden="true"></ion-icon>Kontakte laden</ion-button> 
      <!-- page 145 -->
      <ion-button @click="createContact()" fill="clear" aria-label="Add"> 
        <ion-icon name="add-outline" aria-hidden="true"></ion-icon> Erstelle Kontakt </ion-button>
        <ion-list>
          <ion-item v-for="contact in contacts" :key="contact.givenName" @click="openDetail(contact)">
            <ion-label>
              {{ contact.givenName }} {{ contact.familyName }}<br />
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-modal :is-open="showDetail" @didDismiss="closeDetail()">
  <ion-content>
    <ion-toolbar>
      <ion-title>Kontakt Details</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeDetail()">Schließen</ion-button>
      </ion-buttons>
    </ion-toolbar>
    <div v-if="selectedContact">
      <p>{{ selectedContact.givenName }} {{ selectedContact.familyName }}</p>
      <p v-if="selectedContact.phoneNumbers?.length">
        <ion-icon name="call-outline"></ion-icon>
        {{ selectedContact.phoneNumbers[0].value }}
      </p>
      <p v-if="selectedContact.emailAddresses?.length">
        <ion-icon name="at-outline"></ion-icon>
        {{ selectedContact.emailAddresses[0].value }}
      </p>
      <p v-if="selectedContact.birthday">
        <ion-icon name="balloon-outline"></ion-icon>
        {{ selectedContact.birthday.day }}.{{ selectedContact.birthday.month }}.{{ selectedContact.birthday.year }}
      </p>
    </div>
        <ion-button @click="confirmAndDeleteContact()">
          <ion-icon name="trash-outline"></ion-icon>
        </ion-button>
  </ion-content>
</ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { IonList, IonItem, IonLabel, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
import { Contacts } from '@capawesome-team/capacitor-contacts';
import { ref, onMounted } from 'vue';
import { addIcons } from 'ionicons';
import { addOutline, atOutline, balloonOutline, callOutline, reloadOutline, trashOutline } from 'ionicons/icons';
import { IonModal, IonButtons } from '@ionic/vue';  

addIcons({
  'add-outline': addOutline,
  'reload-outline': reloadOutline,
  'call-outline': callOutline,
  'at-outline': atOutline, 
  'balloon-outline': balloonOutline,
  'trash-outline': trashOutline
});

onMounted(() => {
  requestPermissions();
  getContacts();
});

const contacts = ref<any[]>([]);
const showDetail = ref(false);
const selectedContact = ref<any | null>(null);

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
};

const totalContacts = ref<number | null>(null);
const countContacts = async () => {
  const { total } = await Contacts.countContacts();
  totalContacts.value = total;
  console.log('Total contacts:', totalContacts.value);
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
  const confirmed = window.confirm('Möchtest du diesen Kontakt wirklich löschen?');
  if (confirmed) {
    await deleteContactById(selectedContact.value.id);
    closeDetail();
  }
};

const deleteContactById = async (contactId: string) => {
  await Contacts.deleteContactById({ id: contactId });
  await getContacts();
  await countContacts();
}

const createContact = async () => {}

const requestPermissions = async () => {
  const status = await Contacts.requestPermissions();
  if (status.granted) {
    await getContacts();
    await countContacts();
  } else {
    console.warn('Keine Berechtigung für Kontakte');
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
