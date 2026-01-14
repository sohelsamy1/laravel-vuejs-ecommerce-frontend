<script setup>
import cogoToast from "cogo-toast";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/productStore";
import { onBeforeMount, watch, ref } from "vue";
import ProductSpecification from "../components/frontend/ProductSpecification.vue";

const store = useProductStore();
const route = useRoute();
const router = useRouter();

// Template State
const activeImage = ref("");
const selectedSize = ref("");
const selectedColor = ref("");
const quantity = ref(1);

// Quantity Increment
const incrementQty = () => {
  quantity.value++;
};

// Quantity Decrement
const decrementQty = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Load Product Details
const loadAll = async () => {
  const id = route.query.id;
  await store.fetchProductDetailsById(id);
  activeImage.value = store.productImages[0] || "";
};

onBeforeMount(loadAll);
watch(() => route.query.id, loadAll);

// ✅ ADD TO CART + REDIRECT TO CART
const onAddToCart = async () => {
  try {
    if (!selectedSize.value)
      return cogoToast.error("Please select a size");

    if (!selectedColor.value)
      return cogoToast.error("Please select a color");

    if (!quantity.value || quantity.value < 1)
      return cogoToast.error("Please select a quantity");

    const id = route.query.id;

    await store.addToCart({
      product_id: id,
      size: selectedSize.value,
      color: selectedColor.value,
      qty: quantity.value,
    });

    cogoToast.success("Added to cart");
    router.push("/cart"); // ✅ redirect
  } catch (e) {
    cogoToast.error("Failed to add to cart");
  }
};

// Wishlist
const onAddToWishlist = async () => {
  const id = route.query.id;
  await store.addToWishlist(id);
  cogoToast.success("Added to wishlist");
};
</script>

<template>
  <div class="section">
    <div class="container">

      <!-- Loading -->
      <div class="row" v-if="store.productLoading">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-3">Loading product...</p>
        </div>
      </div>

      <!-- Error -->
      <div class="row" v-else-if="!store.productDetails">
        <div class="col-12 text-center py-5">
          <p class="text-muted">
            {{ store.productError || "Product not found" }}
          </p>
        </div>
      </div>

      <!-- Product -->
      <div class="row" v-else>
        <!-- Images -->
        <div class="col-lg-6">
          <img
            class="w-100"
            :src="activeImage"
            :alt="store.productDetails.product.title"
          />

          <div class="row mt-2">
            <button
              v-for="(img, i) in store.productImages"
              :key="i"
              class="col-3 btn btn-link"
              @click="activeImage = img"
              type="button"
            >
              <img :src="img" class="w-100" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div class="col-lg-6">
          <h4>{{ store.productDetails.product.title }}</h4>
          <h2>$ {{ store.productDetails.product.price }}</h2>

          <p>{{ store.productDetails.product.short_des }}</p>

          <!-- Size -->
          <label class="mt-3">Size</label>
          <select v-model="selectedSize" class="form-select">
            <option value="">Choose Size</option>
            <option v-for="s in store.productSizes" :key="s" :value="s">
              {{ s }}
            </option>
          </select>

          <!-- Color -->
          <label class="mt-3">Color</label>
          <select v-model="selectedColor" class="form-select">
            <option value="">Choose Color</option>
            <option v-for="c in store.productColors" :key="c" :value="c">
              {{ c }}
            </option>
          </select>

          <hr />

          <!-- Quantity -->
          <div class="d-flex align-items-center">
            <button class="btn btn-light" @click="decrementQty">-</button>
            <input
              type="text"
              class="form-control mx-2 text-center"
              style="width: 60px"
              v-model="quantity"
            />
            <button class="btn btn-light" @click="incrementQty">+</button>
          </div>

          <!-- Buttons -->
          <div class="mt-4">
            <button
              class="btn btn-danger"
              type="button"
              @click="onAddToCart"
            >
              <i class="icon-basket-loaded"></i> Add to Cart
            </button>

            <button
              class="btn btn-outline-danger ms-2"
              type="button"
              @click="onAddToWishlist"
            >
              <i class="fa fa-heart"></i>
            </button>
          </div>

          <hr />

          <!-- Description -->
          <div v-if="store.productDetails.des">
            <h5>Description</h5>
            <p>{{ store.productDetails.des }}</p>
          </div>
        </div>
      </div>

      <ProductSpecification />
    </div>
  </div>
</template>
