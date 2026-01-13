<script setup>
import cogoToast from "cogo-toast";
import { useRoute } from "vue-router";
import { useProductStore } from "../stores/productStore";
import { onBeforeMount, watch, ref } from "vue";

const store = useProductStore();
const route = useRoute();

// Template State
const activeImage = ref("");
const selectedSize = ref("");
const selectedColor = ref("");
const quantity = ref(1);

// Qunatity Increment
const incrementQty = () => {
  quantity.value++;
};

// Qunatity Decrement
const decrementQty = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Load Product Details and Reviews
const loadAll = async () => {
  const id = route.query.id;
  await store.fetchProductDetailsById(id);

  activeImage.value = store.productImages[0] || "";
};

onBeforeMount(async () => {
  await loadAll();
});

watch(() => route.query.id, loadAll);

const onAddToCart = async () => {
  if (!selectedSize.value) return cogoToast.error("Please select a size");
  if (!selectedColor.value) return cogoToast.error("Please select a color");
  if (!quantity.value || quantity.value < 1) {
    return cogoToast.error("Please select a quantity");
  }

  const id = route.query.id;
  await store.addToCart({
    product_id: id,
    size: selectedSize.value,
    color: selectedColor.value,
    qty: quantity.value,
  });
};
</script>

<template>
  <!-- Section -->
  <div class="section">
    <div class="container">
      <!-- Loading -->
      <div class="row" v-if="store.productLoading">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading product...</p>
        </div>
      </div>

      <!-- Error / Not Found -->
      <div class="row" v-else-if="!store.productDetails">
        <div class="col-12 text-center py-5">
          <p class="text-muted mb-0">
            {{ store.productError || "Product not found." }}
          </p>
        </div>
      </div>

      <!-- Product Details -->
      <div class="row" v-else>
        <!-- Images -->
        <div class="col-lg-6 col-md-6 mb-4 mb-md-0">
          <div class="product-image">
            <div class="product_img_box">
              <img
                class="w-100"
                :src="activeImage"
                :alt="store.productDetails?.product?.title"
              />
            </div>

            <div class="row p-2">
              <button
                v-for="(img, index) in store.productImages"
                :key="index"
                type="button"
                class="col-3 product_img_box p-1 btn btn-link"
                @click="activeImage = img"
              >
                <img :src="img" class="w-100" :alt="`Thumb - ${index}`" />
              </button>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="col-lg-6 col-md-6">
          <div class="pr_detail">
            <div class="product_description">
              <h4 class="product_title">
                {{ store.productDetails?.product?.title }}
              </h4>
              <h1 class="price">
                $ {{ store.productDetails?.product?.price }}
              </h1>
            </div>

            <div>
              <p>
                {{ store.productDetails?.product?.short_des }}
              </p>
            </div>

            <!-- Size -->
            <label class="form-label mt-3">Size</label>
            <select v-model="selectedSize" class="form-select">
              <option value="">Choose Size</option>
              <option v-for="s in store.productSizes" :key="s" :value="s">
                {{ s }}
              </option>
            </select>

            <!-- Color -->
            <label class="form-label mt-3">Color</label>
            <select v-model="selectedColor" class="form-select">
              <option value="">Choose Color</option>
              <option v-for="c in store.productColors" :key="c" :value="c">
                {{ c }}
              </option>
            </select>

            <hr />

            <div class="cart_extra">
              <div class="cart-product-quantity">
                <div class="quantity">
                  <input
                    type="button"
                    value="-"
                    class="minus"
                    @click="decrementQty"
                  />
                  <input
                    type="text"
                    name="quantity"
                    title="Qty"
                    class="qty"
                    size="4"
                    v-model="quantity"
                  />
                  <input
                    type="button"
                    value="+"
                    class="plus"
                    @click="incrementQty"
                  />
                </div>
              </div>

              <div class="cart_btn">
                <button
                  @click="onAddToCart"
                  class="btn btn-fill-out btn-addtocart"
                  type="button"
                >
                  <i class="icon-basket-loaded"></i> Add to cart
                </button>
                <button class="btn btn-link add_wishlist" type="button">
                  <i class="fa fa-heart"></i>
                </button>
              </div>
            </div>

            <hr />

            <!-- Long Description -->
            <div v-if="store.productDetails?.des" class="mt-3">
              <h5>Description</h5>
              <div>
                <p>
                  {{ store.productDetails?.des }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Specification (placeholder for static HTML) -->
      <div class="product-specification mt-5">
        <h4>Specifications</h4>
        <ul>
          <li>Material: Example Material</li>
          <li>Dimensions: 10 x 20 x 5 cm</li>
          <li>Weight: 500g</li>
          <li>Model: ABC-123</li>
        </ul>
      </div>
    </div>
  </div>
</template>
