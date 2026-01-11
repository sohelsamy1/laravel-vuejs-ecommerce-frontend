import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../services/apiClient";

export const useProductStore = defineStore("productStore", () => {
  // Fetch Category
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/CategoryList");
      console.log(res.data.data);
      return res.data.data;
    } catch (e) {
      cogoToast.error("Something went wrong");
    }
  };

  return {
    // Categories
    fetchCategories,
  };
});
