<script setup lang="ts">
import { showDetail, closeDetail, selectedContact, callNumber, copyToClipboard, writeMail, confirmAndDeleteContact, updateContact } from "@/logic";
import { IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel } from "@ionic/vue";
</script>

<template>
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
</template>