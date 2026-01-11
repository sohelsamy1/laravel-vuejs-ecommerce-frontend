<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="footer_dark">
    <div class="footer_top">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-sm-12">
            <div class="widget">
              <div class="footer_logo">
                <router-link to="/">
                  <img src="../../assets/images/logo_light.png" alt="logo" />
                </router-link>
              </div>
              <p>
                If you are going to use of Lorem Ipsum need to be sure there
                isn't hidden of text
              </p>
            </div>
            <div class="widget">
              <ul class="social_icons social_white">
                <li>
                  <a href="https://www.facebook.com"
                    ><i class="ion-social-facebook"></i
                  ></a>
                </li>
                <li>
                  <a href="https://www.twitter.com"
                    ><i class="ion-social-twitter"></i
                  ></a>
                </li>
                <li>
                  <a href="https://www.google.com"
                    ><i class="ion-social-googleplus"></i
                  ></a>
                </li>
                <li>
                  <a href="https://www.youtube.com"
                    ><i class="ion-social-youtube-outline"></i
                  ></a>
                </li>
                <li>
                  <a href="https://www.instagram.com"
                    ><i class="ion-social-instagram-outline"></i
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-lg-2 col-md-3 col-sm-6">
            <div class="widget">
              <h6 class="widget_title">Useful Links</h6>
              <ul class="widget_links">
                <li>
                  <router-link to="/policy?type=about">About Us</router-link>
                </li>
                <li>
                  <router-link to="/policy?type=how to buy"
                    >How to Buy</router-link
                  >
                </li>
                <li>
                  <router-link to="/policy?type=contact">Contact</router-link>
                </li>
                <li>
                  <router-link to="/policy?type=complain">Complain</router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-lg-2 col-md-3 col-sm-6">
            <div class="widget">
              <h6 class="widget_title">Legals</h6>
              <ul class="widget_links">
                <li>
                  <router-link to="/policy?type=refund"
                    >Refund Policy</router-link
                  >
                </li>
                <li>
                  <router-link to="/policy?type=terms"
                    >Terms & Condition</router-link
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="col-lg-2 col-md-6 col-sm-6">
            <div class="widget">
              <h6 class="widget_title">My Account</h6>
              <ul class="widget_links">
                <li><router-link to="/profile">Profile</router-link></li>
                <li><router-link to="/wish">Wish List</router-link></li>
                <li><router-link to="/cart">Cart List</router-link></li>
                <li><router-link to="/orders">Order History</router-link></li>
              </ul>
            </div>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="widget">
              <h6 class="widget_title">Contact Info</h6>
              <ul class="contact_info contact_info_light">
                <li>
                  <i class="ti-location-pin"></i>
                  <p>123 Street, Old Trafford, New South London , UK</p>
                </li>
                <li>
                  <i class="ti-email"></i>
                  <a href="mailto:info@apple.com">info@apple.com</a>
                </li>
                <li>
                  <i class="ti-mobile"></i>
                  <p>+ 457 789 789 65</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_footer border-top-tran">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-md-0 text-center text-md-start">
              © {{ currentYear }} All Rights Reserved by Apple Shop
            </p>
          </div>
          <div class="col-md-6">
            <ul class="footer_payment text-center text-lg-end">
              <li>
                <a href="#"
                  ><img src="../../assets/images/visa.png" alt="visa"
                /></a>
              </li>
              <li>
                <a href="#"
                  ><img src="../../assets/images/discover.png" alt="discover"
                /></a>
              </li>
              <li>
                <a href="#"
                  ><img
                    src="../../assets/images/master_card.png"
                    alt="master_card"
                /></a>
              </li>
              <li>
                <a href="#"
                  ><img src="../../assets/images/paypal.png" alt="paypal"
                /></a>
              </li>
              <li>
                <a href="#"
                  ><img
                    src="../../assets/images/amarican_express.png"
                    alt="amarican_express"
                /></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
