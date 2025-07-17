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
      <ion-button @click="getContacts">Kontakte laden</ion-button>
      <ion-button @click="createContact"> ➕ </ion-button>

        <ion-list>
          <ion-item v-for="contact in contacts" :key="contact.id" @click="displayContactById(contact.id)">
            <ion-label>
              {{ contact.givenName }} {{ contact.familyName }}<br />
              <span v-if="contact.phoneNumbers?.length">📞 {{ contact.phoneNumbers[0].value }}</span><br />
              <span v-if="contact.emailAddresses?.length">✉️ {{ contact.emailAddresses[0].value }}</span>
            </ion-label>
          </ion-item>
        </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { alertController, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { Contacts, EmailAddressType, PhoneNumberType, PostalAddressType } from '@capawesome-team/capacitor-contacts';
import { ref, onMounted } from 'vue';
const contacts = ref<any[]>([]);
const accounts = ref<any[]>([]);

const getAccounts = async () => {
  const { accounts: result } = await Contacts.getAccounts();
  accounts.value = result;

};

const getContacts = async () => {
  try {
    const { contacts: result } = await Contacts.getContacts({
    fields: ['givenName', 'familyName', 'emailAddresses', 'phoneNumbers', 'postalAddresses'],
  });
  contacts.value = result;
  } catch (error) {
    showErrorAlert.value = true;
  }
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

onMounted(() => {
  // countContacts();
  // getContacts();
  // getAccounts();
  requestPermissions();
});

const createContact = async () => {}




const checkPermissions = async () => {
  return Contacts.checkPermissions();
};

const requestPermissions = async () => {
  // return Contacts.requestPermissions();
  const status = await Contacts.requestPermissions();
  if (status.granted) {
    getContacts();
    countContacts();
    getAccounts();
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
