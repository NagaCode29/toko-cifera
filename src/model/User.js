class User {
   constructor(id,email,password, name, created_at, updated_at) {
       this.id = id;
       this.email = email;
       this.password = password;
       this.name = name;
       this.created_at = created_at;
       this.updated_at = updated_at;
   }
}

export default User;
