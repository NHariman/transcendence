import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";

export type settings = {
  userId: string | string[];
  playerName: string;
  twoFA: boolean;
};

export type avatar = {
  url: string | undefined;
};

export const useAccountSettings = defineStore("accountSettings", {
  state: () => {
    return {
      accountSettings: {} as settings,
      avatar: {} as avatar,
    };
  },
  actions: {
    async getAccountSettings() {
      try {
        const res = await apiRequest(
          `/user/id/${this.accountSettings.userId}`,
          "get"
        );
        this.accountSettings.playerName = res.data.playerName;
        this.accountSettings.twoFA = res.data.twoFA;
      } catch (error) {
        console.log(`Error in getAccountSettings(): ${error}`);
      }
    },

    // ADDED BY SANNE -> NOT WORKING YET
    async updatePlayername(newPlayerName: string) {
      console.log("IN UPDATE PLAYERNAME");
      try {
        await apiRequest(
          `/user/${this.accountSettings.userId}/update-settings`,
          "put",
          { data: { playerName: newPlayerName } }
        );
      } catch (error) {
        alert("error in updatePlayername");
      }
    },

    async updateAccountSettings(
      newPlayerName: string,
      twoFA: boolean | undefined
    ) {
      try {
        await apiRequest(
          `/user/${this.accountSettings.userId}/update-settings`,
          "put",
          { data: { playerName: newPlayerName, twoFA: twoFA } }
        );
        this.getAccountSettings(); /* how to protect this? */
        alert("Your account settings succesfully updated");
      } catch (error) {
        console.log(`Error in updateAccountSettings(): ${error}`);
      }
    },
    setUserId(userId: string | string[]) {
      this.accountSettings.userId = userId;
    },

    async getAvatar() {
      try {
        const res = await apiRequest(
          `/user/${this.accountSettings.userId}/avatar`,
          "get"
        );
        this.avatar.url = res.config.url;
      } catch (error) {
        console.log(`Error in getAvatar(): ${error}`);
      }
    },

    async updateAvatar(selectedFile: File) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await apiRequest(
          `/user/${this.accountSettings.userId}/avatar`,
          "post",
          {
            data: formData,
          }
        );
      } catch (error) {
        console.log(`Error in updateAvatar(): ${error}`);
      }
    },
  },
});
