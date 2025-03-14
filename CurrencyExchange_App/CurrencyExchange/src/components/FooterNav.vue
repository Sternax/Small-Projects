<script setup></script>
<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/">
          <img class="navIcons" src="../components/icons/swap.png" alt="exchange_icon" />
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/rates"
          ><img class="navIcons" src="../components/icons/rates_icon.png" alt="rates_icon"
        /></RouterLink>
      </li>
      <li>
        <RouterLink to="/about"
          ><img
            class="navIcons"
            id="aboutIcon"
            src="../components/icons/about_icon1.png"
            alt="about_icon"
        /></RouterLink>
      </li>
      <li>
        <RouterLink to="/contact"
          ><img class="navIcons" src="../components/icons/contact_icon1.png" alt="contact_icon"
        /></RouterLink>
      </li>
    </ul>
  </nav>
</template>
<style scoped>
.navIcons {
  width: 30px;
  height: 30px;
  display: block;
}

nav {
  background-color: #393e46;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
}

ul {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
  height: 100%;
}

li {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
