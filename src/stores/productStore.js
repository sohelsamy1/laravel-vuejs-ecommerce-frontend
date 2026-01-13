import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../services/apiClient";

export const useProductStore = defineStore("productStore", () => {
  // State for Sliders
  const sliderItems = ref([]);
  const sliderLoading = ref(false);
  const sliderError = ref("");

  // State for Top Categories
  const categories = ref([]);
  const categoriesLoading = ref(false);
  const categoriesError = ref("");

  // Exclusive Products State
  const popularProducts = ref([]);
  const newProducts = ref([]);
  const topProducts = ref([]);
  const specialProducts = ref([]);
  const trendingProducts = ref([]);
  const loading = ref(false);

  // --- Top Brands ---
  const brands = ref([]);
  const brandsLoading = ref(false);
  const brandsError = ref("");

  // State for Category Page
  const categoryProducts = ref([]);
  const categoryName = ref("");
  const categoryLoading = ref(false);
  const categoryError = ref("");

  // State for Brand Page
  const brandProducts = ref([]);
  const brandName = ref("");
  const brandLoading = ref(false);
  const brandError = ref("");

  // Single Product States
  const productDetails = ref(null);
  const productImages = ref([]);
  const productSizes = ref([]);
  const productColors = ref([]);
  const detailsLoading = ref(false);
  const detailsError = ref("");

  // ===================Actions=====================

  // Fetch Sliders
  const fetchSlider = async () => {
    sliderLoading.value = true;
    try {
      const res = await apiClient.get("/ListProductSlider");
      sliderItems.value = res?.data?.data ?? [];
    } catch (err) {
      sliderItems.value = [];
      sliderError.value = "Failed to load sliders";
    } finally {
      sliderLoading.value = false;
    }
  };

  // Fetch Category for Menu
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/CategoryList");
      // console.log(res.data.data);
      return res.data.data;
    } catch (e) {
      cogoToast.error("Something went wrong");
    }
  };

  // Fetch Top Categories
  const fetchTopCategories = async () => {
    categoriesLoading.value = true;
    try {
      const res = await apiClient.get("/CategoryList");
      categories.value = res?.data?.data ?? [];
    } catch (err) {
      categories.value = [];
      categoriesError.value = "Failed to load top categories";
    } finally {
      categoriesLoading.value = false;
    }
  };

  // Fetch Exclusive Products
  const fetchProductsByRemark = async (remark) => {
    loading.value = true;
    try {
      const response = await apiClient.get(
        `/ListProductByRemark/${remark.toLowerCase()}`
      );

      if (response.status === 200) {
        const products = response.data.data;

        // Update the corresponding product array based on remark
        switch (remark.toLowerCase()) {
          case "popular":
            popularProducts.value = products;
            break;
          case "new":
            newProducts.value = products;
            break;
          case "top":
            topProducts.value = products;
            break;
          case "special":
            specialProducts.value = products;
            break;
          case "trending":
            trendingProducts.value = products;
            break;
          default:
            console.warn(`Unknown remark: ${remark}`);
        }
      }
    } catch (error) {
      // console.error(`Error fetching ${remark} products:`, error);
      cogoToast.error(`Failed to load ${remark} products`);
    } finally {
      loading.value = false;
    }
  };

  // Helper Function to navigate the tab
  // Load products for a single tab
  const loadProductsByTab = async (tabName) => {
    await fetchProductsByRemark(tabName);
  };

  // --- Top Brands ---
  const fetchTopBrands = async () => {
    brandsLoading.value = true;
    brandsError.value = "";
    try {
      const res = await apiClient.get("/BrandList");
      brands.value = res?.data?.data || [];
    } catch (err) {
      console.error("Failed to load brands:", err);
      brands.value = [];
      brandsError.value = "Failed to load brands.";
      cogoToast.error("Failed to load brands.");
    } finally {
      brandsLoading.value = false;
    }
  };

  // Load Products for Single Category Page
  const fetchProductsByCategory = async (categoryId) => {
    categoriesLoading.value = true;
    try {
      const categoryRes = await apiClient.get(`/CategoryList`);
      const categories = categoryRes?.data?.data || [];
      const found = categories.find((c) => c.id == categoryId);
      categoryName.value = found?.categoryName || "";

      const res = await apiClient.get(`/ListProductByCategory/${categoryId}`);
      console.log(res);
      categoryProducts.value = res?.data?.data ?? [];
    } catch (e) {
      categoriesError.value = "Failed to load top categories";
      categoryProducts.value = [];
    } finally {
      categoriesLoading.value = false;
    }
  };

  // Load Products for Single Brand Page
  const fetchProductsByBrand = async (brandId) => {
    brandLoading.value = true;
    try {
      const brandRes = await apiClient.get(`/BrandList`);
      const brands = brandRes?.data?.data || [];
      const found = brands.find((b) => b.id == brandId);
      brandName.value = found?.brandName || "";

      const res = await apiClient.get(`/ListProductByBrand/${brandId}`);
      console.log(res);
      brandProducts.value = res?.data?.data ?? [];
    } catch (e) {
      brandError.value = "Failed to load top categories";
      brandProducts.value = [];
    } finally {
      brandLoading.value = false;
    }
  };

  // Fetch Single Product Details
  const fetchProductDetailsById = async (id) => {
    detailsLoading.value = true;
    try {
      const res = await apiClient.get(`/ProductDetailsById/${id}`);
      const list = res?.data?.data || [];
      const row = list[0] || null;
      // console.log(row);

      productDetails.value = row;

      // Images
      productImages.value = [row?.img1, row?.img2, row?.img3, row?.img4].filter(
        Boolean
      );

      // Size
      productSizes.value = (row?.size || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Colors
      productColors.value = (row?.color || "")
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    } catch (e) {
      detailsError.value = "Failed to load product details";
      productDetails.value = null;
      productImages.value = [];
      productSizes.value = [];
      productColors.value = [];
      cogoToast.error("Failed to load product.");
    } finally {
      detailsLoading.value = false;
    }
  };

  // Add to Cart
  const addToCart = async ({ product_id, color, size, qty }) => {
    try {
      await apiClient.post("/CreateCartList", {
        product_id,
        color,
        size,
        qty,
      });
      cogoToast.success("Product added to cart");
    } catch (e) {
      // console.error(e);
      cogoToast.error("Failed to add product to cart");
    }
  };

  return {
    // Categories
    fetchCategories,

    // Top Categories
    categories,
    categoriesLoading,
    categoriesError,
    fetchTopCategories,

    // Sliders
    sliderItems,
    sliderLoading,
    sliderError,
    fetchSlider,

    // Exclusive Products
    popularProducts,
    newProducts,
    topProducts,
    specialProducts,
    trendingProducts,
    loading,
    loadProductsByTab,
    fetchProductsByRemark,

    // Top Brands
    brands,
    brandsLoading,
    brandsError,
    fetchTopBrands,

    // Category Page
    categoryProducts,
    categoryName,
    categoryLoading,
    categoryError,
    fetchProductsByCategory,

    // Brand Page
    brandProducts,
    brandName,
    brandLoading,
    brandError,
    fetchProductsByBrand,

    // Product Details
    productDetails,
    productImages,
    productSizes,
    productColors,
    detailsLoading,
    detailsError,
    fetchProductDetailsById,

    // Add to cart
    addToCart,
  };
});
