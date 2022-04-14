import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthserviceService } from 'src/app/auth/authservice.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = "";
  enteredTitle = "";
  post: Post;
  isLoading = false;
  mode = 'create';
  postId: any;
  form: FormGroup;
  imagePreview: any;
  private authStatusSub: Subscription
  

  constructor(public postService:PostsService, public route : ActivatedRoute, private authService: AuthserviceService ) { }

  onAddPost() {
    
    if(this.form.invalid) {
      return 
      }
     this.isLoading = true;

      if(this.mode ==='create') {
      return this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image),
      this.form.reset();
      } 
       
       else {
      return this.postService.updatePost(
        this.postId, 
        this.form.value.title, 
        this.form.value.content, 
        this.form.value.image
        ),
      this.form.reset()
      } 
      
    };

    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file)
      
    }
  

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null,{validators: [Validators.required, Validators.minLength(3)] }),
        content: new FormControl(null, {validators: [Validators.required] }),
        image: new FormControl(null, {validators: [Validators.required], asyncValidators:[mimeType]})
    })
   this.route.paramMap.subscribe((paramMap: ParamMap) => {
     if (paramMap.has('postId')) {
         this.mode = 'edit';
         this.postId = paramMap.get('postId');
         // place for spinner
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe((postData) => {
            // place for spinner
            this.isLoading = false
            this.post = { 
              //id:postData._id, 
              title:postData.title, 
              content:postData.content ,
              imagePath:postData.imagePath,
              user:postData.user
            };
            this.form.setValue({ 
              title:this.post.title, 
              content:this.post.content, 
              image:this.post.imagePath
            })
          })
        }
     else {
       this.mode = 'create';
       this.postId = null
     }
   });
  }

}
