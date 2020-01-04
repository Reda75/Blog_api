<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">Vue App</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <router-link to="/signin">
          <b-button id="navBarButton" size="sm" class="my-2 my-sm-0" type="submit" data-toggle="modal" data-target="#modalRegisterForm">
            Sign up
          </b-button>
      </router-link>

      <router-link to="/login">
        <b-button id="navBarButton" size="sm" class="my-1 my-sm-0" type="submit" data-toggle="modal" data-target="#modalLoginForm">
          Log in
        </b-button>
      </router-link>

        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
  
</template>

<script>
    export default {
      name: "header"
    }
</script>

<style scoped>
  #navBarButton{
    margin-left: 20px;
    margin-right: 20px;
  }

</style>
