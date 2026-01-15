// src/stores/productStore.js
import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/apiClient";

export const useProductStore = defineStore("productStore", () => {
  // =========================
  // STATE
  // =========================

  // Sliders
  const sliderItems = ref([]);
  const sliderLoading = ref(false);
  const sliderError = ref("");

  // Categories (Top)
  const categories = ref([]);
  const categoriesLoading = ref(false);
  const categoriesError = ref("");

  // Products by remark
  const popularProducts = ref([]);
  const newProducts = ref([]);
  const topProducts = ref([]);
  const specialProducts = ref([]);
  const trendingProducts = ref([]);
  const loading = ref(false);

  // Brands
  const brands = ref([]);
  const brandsLoading = ref(false);
  const brandsError = ref("");

  // Category page
  const categoryProducts = ref([]);
  const categoryName = ref("");
  const categoryLoading = ref(false);
  const categoryError = ref("");

  // Brand page
  const brandProducts = ref([]);
  const brandName = ref("");
  const brandLoading = ref(false);
  const brandError = ref("");

  // Product details
  const productDetails = ref(null);
  const productImages = ref([]);
  const productSizes = ref([]);
  const productColors = ref([]);
  const detailsLoading = ref(false);
  const detailsError = ref("");

  // Reviews
  const reviews = ref([]);
  const reviewsLoading = ref(false);
  const reviewsError = ref("");

  // Cart
  const cartItems = ref([]);
  const cartLoading = ref(false);
  const cartError = ref("");

  // Orders
  const orders = ref([]);
  const ordersLoading = ref(false);
  const ordersError = ref("");

  // Invoice modal state
  const invoiceProducts = ref([]);
  const invoiceLoader = ref(false);
  const showInvoiceModal = ref(false);

  // Invoice / Payment
  const paymentMethods = ref([]); // optional fallback
  const paymentUrl = ref(""); // ✅ SSLCommerz URL
  const invoiceLoading = ref(false);
  const invoiceError = ref("");

  // =========================
  // ACTIONS
  // =========================

  // -------------------------
  // Sliders
  // -------------------------
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

  // -------------------------
  // Categories
  // -------------------------
  // For menu dropdown
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/CategoryList");
      return res?.data?.data ?? [];
    } catch (e) {
      cogoToast.error("Something went wrong");
      return [];
    }
  };

  // Top categories (home page, etc.)
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

  // -------------------------
  // Products by remark
  // -------------------------
  const fetchProductsByRemark = async (remark) => {
    loading.value = true;
    try {
      const response = await apiClient.get(
        `/ListProductByRemark/${String(remark || "").toLowerCase()}`
      );

      if (response?.status === 200) {
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

  const loadProductsByTab = async (tabName) => {
    await fetchProductsByRemark(tabName);
  };

  // -------------------------
  // Brands
  // -------------------------
  const fetchTopBrands = async () => {
    brandsLoading.value = true;
    brandsError.value = "";
    try {
      const res = await apiClient.get("/BrandList");
      brands.value = res?.data?.data ?? [];
    } catch (err) {
      brands.value = [];
      brandsError.value = "Failed to load brands.";
      cogoToast.error("Failed to load brands.");
    } finally {
      brandsLoading.value = false;
    }
  };

  // -------------------------
  // Category Page
  // -------------------------
  const fetchProductsByCategory = async (categoryId) => {
    categoryLoading.value = true;
    categoryError.value = "";
    try {
      // get category name
      const categoryRes = await apiClient.get("/CategoryList");
      const list = categoryRes?.data?.data ?? [];
      const found = list.find((c) => String(c.id) === String(categoryId));
      categoryName.value = found?.categoryName || "";

      // category products
      const res = await apiClient.get(`/ListProductByCategory/${categoryId}`);
      categoryProducts.value = res?.data?.data ?? [];
    } catch (e) {
      categoryError.value = "Failed to load category products";
      categoryProducts.value = [];
    } finally {
      categoryLoading.value = false;
    }
  };

  // -------------------------
  // Brand Page
  // -------------------------
  const fetchProductsByBrand = async (brandId) => {
    brandLoading.value = true;
    brandError.value = "";
    try {
      // get brand name
      const brandRes = await apiClient.get("/BrandList");
      const list = brandRes?.data?.data ?? [];
      const found = list.find((b) => String(b.id) === String(brandId));
      brandName.value = found?.brandName || "";

      // brand products
      const res = await apiClient.get(`/ListProductByBrand/${brandId}`);
      brandProducts.value = res?.data?.data ?? [];
    } catch (e) {
      brandError.value = "Failed to load brand products";
      brandProducts.value = [];
    } finally {
      brandLoading.value = false;
    }
  };

  // -------------------------
  // Product Details
  // -------------------------
  const fetchProductDetailsById = async (id) => {
    detailsLoading.value = true;
    detailsError.value = "";
    try {
      const res = await apiClient.get(`/ProductDetailsById/${id}`);
      const list = res?.data?.data ?? [];
      const row = list?.[0] ?? null;

      productDetails.value = row;

      productImages.value = [row?.img1, row?.img2, row?.img3, row?.img4].filter(
        Boolean
      );

      productSizes.value = String(row?.size || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      productColors.value = String(row?.color || "")
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

  // -------------------------
  // CART
  // -------------------------
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
      cartLoading.value = false;
    }
  };

  // POST /CreateCartList
  const addToCart = async ({ product_id, color, size, qty }) => {
    try {
      await apiClient.post("/CreateCartList", { product_id, color, size, qty });
      cogoToast.success("Product added to cart");
      await fetchCart();
    } catch (e) {
      cogoToast.error("Failed to add product to cart");
      throw e;
    }
  };

  // ✅ IMPORTANT: তোমার backend route GET
  // Route::get('/DeleteCartList/{product_id}', ...)
  const removeFromCart = async (product_id) => {
    try {
      if (!product_id) {
        cogoToast.error("Product id missing!");
        return;
      }
      await apiClient.get(`/DeleteCartList/${product_id}`);
      cogoToast.success("Removed from cart");
      await fetchCart();
    } catch (e) {
      console.error("DeleteCartList failed:", e);
      cogoToast.error(
        e?.response?.data?.data ||
          e?.response?.data?.message ||
          "Failed to remove item"
      );
      throw e;
    }
  };

  // -------------------------
  // REVIEWS
  // -------------------------
  const createReview = async ({ product_id, description, rating }) => {
    try {
      const body = { product_id, description, rating };
      await apiClient.post("/CreateProductReview", body);
      cogoToast.success("Review added.");
      await fetchReviewsByProduct(product_id);
    } catch (err) {
      cogoToast.error("Failed to add review.");
      throw err;
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
      reviews.value = res?.data?.data ?? [];
    } catch (err) {
      reviews.value = [];
      reviewsError.value = "Failed to load reviews.";
    } finally {
      reviewsLoading.value = false;
    }
  };

  // -------------------------
  // ORDERS
  // -------------------------
  const loadOrders = async () => {
    ordersLoading.value = true;
    ordersError.value = "";
    try {
      const res = await apiClient.get("/InvoiceList");
      orders.value = res?.data?.data ?? [];
    } catch (e) {
      orders.value = [];
      ordersError.value = "Failed to load orders.";
      cogoToast.error(ordersError.value);
    } finally {
      ordersLoading.value = false;
    }
  };

  const loadInvoiceProducts = async (orderId) => {
    invoiceLoader.value = true;
    try {
      const res = await apiClient.get(`/InvoiceProductList/${orderId}`);
      invoiceProducts.value = res?.data?.data ?? res?.data ?? [];
      showInvoiceModal.value = true;
    } catch (e) {
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

  // -------------------------
  // CHECKOUT / INVOICE
  // -------------------------
  // GET /InvoiceCreate
  const createInvoice = async () => {
    invoiceLoading.value = true;
    invoiceError.value = "";
    paymentMethods.value = [];
    paymentUrl.value = "";

    try {
      const res = await apiClient.get("/InvoiceCreate");

      // ✅ your backend returns: { msg:"success", data:{ paymentMethod:"URL", ... } }
      const url = res?.data?.data?.paymentMethod || "";
      if (url) {
        paymentUrl.value = url;
        return res; // ✅ IMPORTANT
      }

      // fallback (if someday backend returns array/list)
      const methods =
        res?.data?.data?.[0]?.paymentMethod ??
        res?.data?.data?.paymentMethods ??
        [];
      paymentMethods.value = Array.isArray(methods) ? methods : [];

      return res; // ✅ IMPORTANT
    } catch (err) {
      if (err?.response?.status === 401) {
        invoiceError.value = "Unauthorized. Please login again.";
      } else {
        invoiceError.value =
          err?.response?.data?.data ||
          err?.response?.data?.message ||
          "Failed to create invoice.";
      }
      cogoToast.error(invoiceError.value);
      throw err;
    } finally {
      invoiceLoading.value = false;
    }
  };

  // =========================
  // EXPORTS
  // =========================
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

    // Products by remark
    popularProducts,
    newProducts,
    topProducts,
    specialProducts,
    trendingProducts,
    loading,
    loadProductsByTab,
    fetchProductsByRemark,

    // Brands
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

    // Cart
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

    // Invoice modal
    invoiceProducts,
    invoiceLoader,
    showInvoiceModal,
    loadInvoiceProducts,
    closeInvoiceModal,

    // Checkout / Invoice
    paymentMethods,
    paymentUrl,
    invoiceLoading,
    invoiceError,
    createInvoice,
  };
});
