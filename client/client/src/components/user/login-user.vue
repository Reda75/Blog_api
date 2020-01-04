<template>
  <div>
    <div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h4 class="modal-title w-100 font-weight-bold">Login</h4>
            <router-link to="/">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </router-link>
          </div>
          <div class="modal-body mx-3">

            <div class="form-group">
              <label for="inputEmail">Email</label>
              <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Eamil">
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>   

            <div class="form-group">
              <label for="inputPassword">Password</label>
              <input type="password" class="form-control" id="inputPassword" placeholder="Password">
            </div>    
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="button" class="btn btn-info">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "login-user",

      computed : {
        getToken(){
          return this.$store.getters.getToken
        }
      },
      methods : {
        setToken(){
          this.$store.dispatch('setToken', 'new token')
        }
      }
    }
</script>

<style scoped>

</style>
