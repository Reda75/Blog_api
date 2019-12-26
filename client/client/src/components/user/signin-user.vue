<template>
   <form @submit="onSubmit">
      <div class="form-group">
        <label for="exampleInputName">Name</label>
        <input v-model="addUserForm.name" type="text" class="form-control" id="exampleInputName" aria-describedby="nameHelp" placeholder="Enter name">
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input v-model="addUserForm.email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">

      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="addUserForm.password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
  </form>
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
              console.log(res.data)
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
