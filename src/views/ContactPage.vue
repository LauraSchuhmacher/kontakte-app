<script setup lang="ts">
import { totalContacts, createContact, getContacts, requestPermissions, countContacts } from "@/logic";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonPage, IonIcon, IonFab, IonFabButton } from "@ionic/vue";
import myIcon from "@/assets/favicon.png";
import { onMounted } from "vue";
import ContactList from "./ContactList.vue";
import ContactDetailModal from "./ContactDetailModal.vue";
import ContactCreateModal from "./ContactCreateModal.vue";

onMounted(async () => {
  await requestPermissions();
});

</script>

<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-title style="display: flex; align-items: center;" >
          <img :src="myIcon" alt="Icon" style="height: 24px; width: 24px; margin-right: 8px; border-radius: 50%;" />
          Kontakte
          <span v-if="totalContacts !== null" style="margin-left: 8px; font-weight: normal;">{{ totalContacts }} </span>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
      </ion-header>
      <ion-button @click="getContacts()" fill="outline" aria-label="Reload">
        <ion-icon name="reload-outline" aria-hidden="true"></ion-icon></ion-button>
      <ContactList /> 
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="createContact()" aria-label="Add">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>

  <ContactDetailModal />
  <ContactCreateModal />

</template>

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
