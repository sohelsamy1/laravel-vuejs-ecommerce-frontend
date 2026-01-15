import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref } from "vue";
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

  // ====== Reviews State ======
  const reviews = ref([]);
  const reviewsLoading = ref(false);
  const reviewsError = ref("");

  // ====== Cart State  (ADDED) ======
  const cartItems = ref([]);
  const cartLoading = ref(false);
  const cartError = ref("");

  // --- Orders ---
  const orders = ref([]);
  const ordersLoading = ref(false);
  const ordersError = ref("");

  // invoice modal state
  const invoiceProducts = ref([]);
  const invoiceLoader = ref(false);
  const showInvoiceModal = ref(false);

  // ===================Actions=====================

  // Fetch Sliders
  const fetchSlider = async () => {
    sliderLoading.value = true;
    sliderError.value = "";
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
      return res?.data?.data ?? [];
    } catch (e) {
      cogoToast.error("Something went wrong");
      return [];
    }
  };

  // Fetch Top Categories
  const fetchTopCategories = async () => {
    categoriesLoading.value = true;
    categoriesError.value = "";
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
        `/ListProductByRemark/${String(remark || "").toLowerCase()}`
      );

      if (response.status === 200) {
        const products = response?.data?.data ?? [];

        switch (String(remark || "").toLowerCase()) {
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
      cogoToast.error(`Failed to load ${remark} products`);
    } finally {
      loading.value = false;
    }
  };

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
    categoryLoading.value = true;
    categoryError.value = "";
    try {
      const categoryRes = await apiClient.get(`/CategoryList`);
      const list = categoryRes?.data?.data || [];
      const found = list.find((c) => c.id == categoryId);
      categoryName.value = found?.categoryName || "";

      const res = await apiClient.get(`/ListProductByCategory/${categoryId}`);
      categoryProducts.value = res?.data?.data ?? [];
    } catch (e) {
      categoryError.value = "Failed to load category products";
      categoryProducts.value = [];
    } finally {
      categoryLoading.value = false;
    }
  };

  // Load Products for Single Brand Page
  const fetchProductsByBrand = async (brandId) => {
    brandLoading.value = true;
    brandError.value = "";
    try {
      const brandRes = await apiClient.get(`/BrandList`);
      const list = brandRes?.data?.data || [];
      const found = list.find((b) => b.id == brandId);
      brandName.value = found?.brandName || "";

      const res = await apiClient.get(`/ListProductByBrand/${brandId}`);
      brandProducts.value = res?.data?.data ?? [];
    } catch (e) {
      brandError.value = "Failed to load brand products";
      brandProducts.value = [];
    } finally {
      brandLoading.value = false;
    }
  };

  // Fetch Single Product Details
  const fetchProductDetailsById = async (id) => {
    detailsLoading.value = true;
    detailsError.value = "";
    try {
      const res = await apiClient.get(`/ProductDetailsById/${id}`);
      const list = res?.data?.data || [];
      const row = list[0] || null;

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

  // ===== CART ACTIONS  (ADDED) =====

  // GET /CartList
  const fetchCart = async () => {
    cartLoading.value = true;
    cartError.value = "";
    try {
      const res = await apiClient.get("/CartList");
      cartItems.value = res?.data?.data ?? [];
    } catch (e) {
      cartItems.value = [];
      cartError.value = "Failed to load cart";
    } finally {
      cartLoading.valueogoToast;
      cartLoading.value = false;
    }
  };

  // POST /CreateCartList
  const addToCart = async ({ product_id, color, size, qty }) => {
    try {
      await apiClient.post("/CreateCartList", {
        product_id,
        color,
        size,
        qty,
      });
      cogoToast.success("Product added to cart");
      await fetchCart();
    } catch (e) {
      cogoToast.error("Failed to add product to cart");
    }
  };

  // POST /RemoveCartList
  const removeFromCart = async (product_id) => {
    try {
      await apiClient.post("/RemoveCartList", { product_id });
      cogoToast.success("Removed from cart");
      await fetchCart(); 
    } catch (e) {
      cogoToast.error("Failed to remove item");
    }
  };

  // ===== REVIEWS =====

  const createReview = async ({ product_id, description, rating }) => {
    try {
      const body = { product_id, description, rating };
      await apiClient.post(`/CreateProductReview`, body);
      cogoToast.success("Review added.");
      await fetchReviewsByProduct(product_id);
    } catch (err) {
      console.error("Failed to add review:", err);
      cogoToast.error("Failed to add review.");
    }
  };

  const fetchReviewsByProduct = async (id) => {
    if (!id) {
      reviewsError.value = "Invalid product.";
      reviews.value = [];
      return;
    }
    reviewsLoading.value = true;
    reviewsError.value = "";
    try {
      const res = await apiClient.get(`/ListReviewByProduct/${id}`);
      reviews.value = res?.data?.data || [];
    } catch (err) {
      console.error("Failed to load reviews:", err);
      reviews.value = [];
      reviewsError.value = "Failed to load reviews.";
    } finally {
      reviewsLoading.value = false;
    }
  };

  // ===== ORDERS =====

  const loadOrders = async () => {
    ordersLoading.value = true;
    ordersError.value = "";
    try {
      const res = await apiClient.get("/InvoiceList");
      orders.value = Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      console.error("Error loading orders:", e);
      ordersError.value = "Failed to load orders.";
      cogoToast.error(ordersError.value);
      orders.value = [];
    } finally {
      ordersLoading.value = false;
    }
  };

  const loadInvoiceProducts = async (orderId) => {
    invoiceLoader.value = true;
    try {
      const res = await apiClient.get(`/InvoiceProductList/${orderId}`);
      invoiceProducts.value = Array.isArray(res?.data) ? res.data : [];
      showInvoiceModal.value = true;
    } catch (e) {
      console.error("Error loading invoice products:", e);
      cogoToast.error("Failed to load invoice products.");
      invoiceProducts.value = [];
    } finally {
      invoiceLoader.value = false;
    }
  };

  const closeInvoiceModal = () => {
    showInvoiceModal.value = false;
    invoiceProducts.value = [];
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

    // Cart ✅
    cartItems,
    cartLoading,
    cartError,
    fetchCart,
    addToCart,
    removeFromCart,

    // Reviews
    reviews,
    reviewsLoading,
    reviewsError,
    fetchReviewsByProduct,
    createReview,

    // Orders
    orders,
    ordersLoading,
    ordersError,
    loadOrders,

    // invoice modal state
    invoiceProducts,
    invoiceLoader,
    showInvoiceModal,
    loadInvoiceProducts,
    closeInvoiceModal,
  };
});
