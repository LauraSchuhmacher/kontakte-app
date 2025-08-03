<script setup lang="ts">
import { groupedContacts, sortedLetters, openDetail} from "@/logic";
import { IonItem, IonLabel, IonList, IonItemDivider } from "@ionic/vue";
</script>

<template>
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
</template>