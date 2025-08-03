<script setup lang="ts">
import { showCreateModal, closeCreateModal, newContact, saveNewContact } from "@/logic";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput, IonDatetime } from "@ionic/vue";
</script>

<template>
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
</template>