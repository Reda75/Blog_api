<template>
  <div>
    <div class="modal fade" id="modalRegisterForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h4 class="modal-title w-100 font-weight-bold">Sign up</h4>
            <router-link to="/">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </router-link>
          </div>
          <div class="modal-body mx-3">

            <div class="form-group">
              <i class="fas fa-user"></i>
              <label for="inputName">Name</label>
              <input type="text" class="form-control" id="inputName" placeholder="Name">
            </div>

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
            <button type="button" class="btn btn-info">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
    export default {
        name: "signin-user",
        data(){
          return{
            addUserForm :{
              name: '',
              email: '',
              password:''
            }
          };
        },
      methods: {
          signIn(payload){
            const path = 'http://localhost:5000/api/v1/users/'
            console.log(payload)
            axios.post(path, payload)
            .then((res) => {
              this.$store.dispatch('setToken', res.data)
              console.log(this.$store.getters.getToken)
            })
            .catch((error) => {
              console.error(error)
            })
          },
        initForm(){
            this.addUserForm.email = '' ;
            this.addUserForm.name = '';
            this.addUserForm.password = '';
        },
        onSubmit(event){
            console.log('onSubmit')
            event.preventDefault();
            const payload = {
              email : this.addUserForm.email,
              name : this.addUserForm.name,
              password : this.addUserForm.password
          }
          this.signIn(payload)
          this.initForm()
        },
         created() {

          },
      }
    };
</script>

<style scoped>

</style>
