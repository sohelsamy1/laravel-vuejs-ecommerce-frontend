<template>
  <!-- START SECTION BREADCRUMB -->
  <div class="breadcrumb_section bg_gray page-title-mini">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="page-title">
            <h1>Wish List</h1>
          </div>
        </div>
        <div class="col-md-6">
          <ol class="breadcrumb justify-content-md-end">
            <li class="breadcrumb-item">
              <router-link to="/">Home</router-link>
            </li>
            <li class="breadcrumb-item">
              <a href="#">This Page</a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-5">
    <div class="container my-5">
      <div id="byList" class="row">
        <div 
          v-for="item in store.wishlist" 
          :key="item.id" 
          class="col-lg-3 col-md-4 col-6"
        >
          <div class="product">
            <div class="product_img">
              <a href="#">
                <img :src="item.image" :alt="item.title">
              </a>
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
                    :style="{ width: item.star + '%' }"
                  ></div>
                </div>
              </div>
              <button 
                class="btn remove btn-sm my-2 btn-danger" 
                @click="onRemove(item.id)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import axios from 'axios'
// import apiClient from '../../services/axiosClient'

import { useProductStore } from '../../stores/productStore'

const store = useProductStore()

console.log(store.wishlist)

const onRemove = async (id) => {
  await store.removeFromWishlist(id)
}

onMounted(async () => {
  await store.fetchWishlist()
})

// const wishlistItems = ref([])

// const loadWishList = async () => {
//   try {
//     const response = await apiClient.get('/ProductWishList')
//     wishlistItems.value = response.data.data
//   } catch (error) {
//     console.error('Error loading wishlist:', error)
//   }
// }

// const removeWishList = async (id) => {
//   try {
//     // Show preloader
//     document.querySelector('.preloader')?.classList.remove('loaded')
    
//     const response = await axios.get(`/RemoveWishList/${id}`)
    
//     if (response.status === 200) {
//       await loadWishList()
//     } else {
//       alert('Request Fail')
//     }
//   } catch (error) {
//     console.error('Error removing item from wishlist:', error)
//     alert('Request Fail')
//   } finally {
//     // Hide preloader
//     document.querySelector('.preloader')?.classList.add('loaded')
//   }
// }

// onMounted(() => {
//   loadWishList()
// })
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

