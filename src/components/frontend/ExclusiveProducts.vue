<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useProductStore } from "../../stores/productStore";

const productStore = useProductStore();
const activeTab = ref("Popular");

// Assign products to the tabs
const tabs = computed(() => [
  { name: "Popular", products: productStore.popularProducts },
  { name: "New", products: productStore.newProducts },
  { name: "Top", products: productStore.topProducts },
  { name: "Special", products: productStore.specialProducts },
  { name: "Trending", products: productStore.trendingProducts },
]);

const setActiveTab = async (tabName) => {
  activeTab.value = tabName;
  const tab = tabs.value.find((t) => t.name === tabName);
  if (tab && tab.products.length === 0) {
    await productStore.loadProductsByTab(tabName);
  }
};

onBeforeMount(async () => {
  await productStore.loadProductsByTab(activeTab.value);
});
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="heading_s1 text-center">
          <h2>Exclusive Products</h2>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <!-- Tabs -->
        <div class="tab-style1">
          <ul class="nav nav-tabs justify-content-center" role="tablist">
            <li
              v-for="tab in tabs"
              :key="tab.name"
              class="nav-item"
              role="presentation"
            >
              <button
                class="nav-link"
                :class="{ active: activeTab === tab.name }"
                type="button"
                role="tab"
                :aria-selected="activeTab === tab.name"
                @click="setActiveTab(tab.name)"
              >
                {{ tab.name }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Tab content -->
        <div class="tab-content">
          <!-- Loading -->
          <div v-if="productStore.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading products...</p>
          </div>
         
          <div
            v-for="tab in tabs"
            :key="tab.name + '-pane'"
            class="tab-pane fade"
            :class="{
              show: activeTab === tab.name,
              active: activeTab === tab.name,
            }"
            v-if="!productStore.loading"
          >
            <div class="row shop_container">
              <!-- Empty state -->
              <div
                v-if="tab.products.length === 0"
                class="col-12 text-center py-5"
              >
                <p class="text-muted">
                  No {{ tab.name.toLowerCase() }} products available at the
                  moment.
                </p>
              </div>

              <!-- Products -->
              <div
                v-for="product in tab.products"
                :key="product.id"
                class="col-lg-3 col-md-4 col-6"
              >
                <div class="product">
                  <div class="product_img">
                    <!-- <router-link :to="`/details?id=${product.id}`"> -->
                    <!-- <img :src="product.image" :alt="product.title" /> -->
                    <img
                      src="https://www.apple.com/v/macbook-pro-14-and-16/a/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg"
                      :alt="product.title"
                    />
                    <!-- </router-link> -->
                    <div class="product_action_box">
                      <ul class="list_none pr_action_btn">
                        <li>
                          <!-- <router-link
                            :to="`/details?id=${product.id}`"
                            class="popup-ajax"
                          > -->
                          <i class="icon-magnifier-add"></i>
                          <!-- </router-link> -->
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="product_info">
                    <h6 class="product_title">
                      <!-- <router-link :to="`/details?id=${product.id}`"> -->
                      {{ product.title }}
                      <!-- </router-link> -->
                    </h6>

                    <div class="product_price">
                      <span class="price">$ {{ product.price }}</span>
                    </div>

                    <div class="rating_wrap">
                      <div class="rating">
                        <div
                          class="product_rate"
                          :style="{ width: product.star + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /product card -->
            </div>
          </div>
          <!-- /pane -->
        </div>
        <!-- /tab-content -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.heading_s1 h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
}
.tab-style1 .nav-tabs {
  border-bottom: 2px solid #eee;
  margin-bottom: 3rem;
}

.tab-style1 .nav-link {
  border: none;
  background: none;
  color: #666;
  font-weight: 600;
  padding: 15px 25px;
  margin-right: 10px;
  border-radius: 0;
  transition: all 0.3s ease;
}

.tab-style1 .nav-link:hover,
.tab-style1 .nav-link.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
  background: none;
}
</style>
