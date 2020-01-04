<template>
    <div class="container">
        <div class="row">
        <div class="col-sm-10">
            <h1>Users</h1>
            <hr><br><br>
            <button type="button" class="btn btn-success btn-sm">Add</button>
            <br><br>
            <table class="table table-hover">
            <thead>
                <tr>
                <th scope="col">First name</th>
                <th scope="col">Last name</th>
                <th scope="col">Email</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users">
                <td>{{user.name}}</td>
                <td>{{user.name}}</td>
                <td>{{user.email}}</td>
                <td>
                    <div class="btn-group" role="group">
                    <button type="button" class="btn btn-warning btn-sm">Update</button>
                    <button type="button" class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
    </div>
</template>

</template>

<script>
import axios from "axios"
    export default {

        name: "users",

        methods :{
            getUsers(){
                return this.$store.dispatch('getUsers')
            }

        },
        computed :{
            users(){
                return this.users = this.$store.getters.getUsers
            }
        },
        created(){
            this.getUsers()
        }

    }
</script>


<style scoped>

</style>
