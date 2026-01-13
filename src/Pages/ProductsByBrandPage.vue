<script setup>
import { useRoute } from "vue-router";
import { useProductStore } from "../stores/productStore";
import { onBeforeMount, watch } from "vue";

const store = useProductStore();
const route = useRoute();

const fetchCurrentBrand = async () => {
  const brandId = route.query.id;
  await store.fetchProductsByBrand(brandId);
};

onBeforeMount(async () => {
  await fetchCurrentBrand();
});

watch(() => route.query.id, fetchCurrentBrand);
</script>

<template>
  <!-- Breadcrumb -->
  <div class="breadcrumb_section bg_gray page-title-mini">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="page-title">
            <h1>
              Brand: <span>{{ store.brandName }}</span>
            </h1>
          </div>
        </div>
        <div class="col-md-6">
          <ol class="breadcrumb justify-content-md-end">
            <li class="breadcrumb-item">
              <router-link to="/">Home</router-link>
            </li>
            <li class="breadcrumb-item active">This Page</li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="mt-5">
    <div class="container my-5">
      <!-- Loading -->
      <div v-if="store.brandLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading brand products...</p>
      </div>

      <!-- Error -->
      <div v-else-if="store.brandError" class="alert alert-danger" role="alert">
        Error message here
      </div>

      <!-- Empty -->
      <div
        v-else-if="store.brandProducts.length === 0"
        class="text-center py-5"
      >
        <p class="text-muted mb-0">No products found for this brand.</p>
      </div>

      <!-- Grid -->
      <div v-else id="byBrandList" class="row">
        <div
          v-for="item in store.brandProducts"
          :key="item.id"
          class="col-lg-3 col-md-4 col-6"
        >
          <div class="product">
            <div class="product_img">
              <router-link :to="`/details?id=${item.id}`">
                <!-- <img :src="item.image" :alt="item.title" /> -->
                <img
                  src="https://www.apple.com/v/macbook-pro-14-and-16/a/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg"
                  alt="Product Title"
                />
              </router-link>
              <div class="product_action_box">
                <ul class="list_none pr_action_btn">
                  <li>
                    <router-link
                      :to="`/details?id=${item.id}`"
                      class="popup-ajax"
                    >
                      <i class="icon-magnifier-add"></i>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>

            <div class="product_info">
              <h6 class="product_title">
                <router-link :to="`/details?id=${item.id}`">
                  {{ item.title }}
                </router-link>
              </h6>
              <div class="product_price">
                <span class="price">$ {{ item.price }}</span>
              </div>
              <div class="rating_wrap">
                <div class="rating">
                  <div
                    class="product_rate"
                    :style="{ width: (item.star || 0) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /col -->
      </div>
      <!-- /row -->
    </div>
  </div>
</template>
