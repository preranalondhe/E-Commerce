import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Toast } from '../service/sweetalert';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  register: any
  constructor(private userService: UserService, private fb: FormBuilder) {
    this.register = this.fb.group({
      "username": ['', Validators.required],
      "email": ['', Validators.required],
      "password": ['', Validators.required],
      "mobile": ['', Validators.required],
      "address": ['', Validators.required],
      "role": ['', Validators.required],
      "area": ['',]

    })
  }


Registeration(){
  alert("click on register button")
  
  console.log(this.register.value);
  // if(this.register.valid){return;}
this.userService.registerUser(this.register.value).subscribe((response:any)=>{
   Toast.fire({
    icon:'success',
    title:response.msg
   })

   this.register.reset();
})

  
}
selectedRole: string = '';

onRoleChange(event: any) {
  this.selectedRole = event.target.value;
}










}
