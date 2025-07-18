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
          <ion-item v-for="contact in contacts" :key="contact.givenName" @click="displayContactById(contact.id)">
            <ion-label>
              {{ contact.givenName }} {{ contact.familyName }}<br />
              <span v-if="contact.phoneNumbers?.length">
                <ion-icon name="call-outline"></ion-icon>{{ contact.phoneNumbers[0].value }}</span><br />
              <span v-if="contact.emailAddresses?.length">
                <ion-icon name="at-outline"></ion-icon> {{ contact.emailAddresses[0].value }}</span><br />
              <span v-if="contact.birthday">
                <ion-icon name="balloon-outline"></ion-icon>{{ contact.birthday.day }}.{{contact.birthday.month }}.{{ contact.birthday.year }}</span><br />
            </ion-label>
          </ion-item>
        </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { IonList, IonItem, IonLabel, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
import { Contacts, EmailAddressType, PhoneNumberType, PostalAddressType } from '@capawesome-team/capacitor-contacts';
import { ref, onMounted } from 'vue';
import { addIcons } from 'ionicons';
import { addOutline, atOutline, balloonOutline, callOutline, reloadOutline } from 'ionicons/icons';
  
addIcons({
  'add-outline': addOutline,
  'reload-outline': reloadOutline,
  'callOutline': callOutline,
  'atOutline': atOutline, 
  'balloonOutline': balloonOutline,
});

onMounted(() => {
  requestPermissions();
  getContacts();
});

const contacts = ref<any[]>([]);

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

const displayContactById = async (id: string) => {
  await Contacts.displayContactById({ id });
};

const getContactById = async (contactId: string) => {
  const { contact } = await Contacts.getContactById({ id: contactId });
  return contact;
};



const createContact = async () => {}




const checkPermissions = async () => {
  return Contacts.checkPermissions();
};

const requestPermissions = async () => {
  // return Contacts.requestPermissions();
  const status = await Contacts.requestPermissions();
  if (status.granted) {
    await getContacts();
    await countContacts();
    // await getAccounts();
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
