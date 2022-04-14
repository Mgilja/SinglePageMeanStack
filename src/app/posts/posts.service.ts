import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PostsService {

 constructor(private http: HttpClient, private router: Router) { }

 private posts: Post[] = [];
 private postsUpdated = new Subject<{posts:Post[], postCount: any}>();

 readonly ROOT_URL =  environment.apiUrl + "/posts/"

 

 getPosts(postsPerPage:number, currentPage:number) {
   const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
   this.http.get<{message:string; posts:any; maxPosts:string}>(this.ROOT_URL + queryParams)
    .pipe(map((postData) => {
      return  { 
           posts: postData.posts.map((post:any) => {
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath: post.imagePath,
          user: post.userData
        };
      }), maxPosts: postData.maxPosts
     };
    })
  )
     .subscribe((transformedPostsData) => {
       console.log(transformedPostsData);
       
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({ posts:[...this.posts], postCount: transformedPostsData.maxPosts})
    });
  }

 getPostUpdateListener() {
   return this.postsUpdated.asObservable();
 }

 getPost(id:string) {
     return this.http.get
     <{_id:string, title:string, content:string, imagePath: string, user:any}>(this.ROOT_URL + id)
     
     
     //{ ...this.posts.find(p => p.id === id)}
     
    }
  
 

 addPost(title:string, content:string, image: File) {
   const postData = new FormData();
   postData.append("title", title);
   postData.append("content", content);
   postData.append("image", image, title)
   this.http.post<{message: string, post:Post}>(this.ROOT_URL, postData)
   .subscribe((responseData) => {
     const post: Post = {
       id:responseData.post.id, 
       title: title, 
       content: content,
       imagePath:responseData.post.imagePath,
       user:null
       
      };

   
   this.router.navigate(["/"])
     })
  }
 
 updatePost(id:string, title:string, content:string, image: File | string ) {
   let postData: Post | FormData;
   if(typeof(image) === 'object') {
        postData = new FormData();
       postData.append("title", title);
       postData.append("content", content);
       postData.append("image", image, title);
   } else {
       postData  = {id: id, title: title, content: content, imagePath:image} ;
   }
    // const post: Post = {id:id, title:title, content:content, imagePath:null };
   
    this.http.put(this.ROOT_URL + id, postData)
   .subscribe((resposne)=> {
    //  const post: Post = {
    //    id:id,
    //    content:content,
    
    //    title:title,
    //    imagePath: ""
    //  }
     this.router.navigate(["/"])
   })
 }

 deletePost(postId:string) {
  return this.http.delete(this.ROOT_URL + postId)
  //  .subscribe(() => {
  //    const updatePost = this.posts.filter((post => post.id !== postId));
  //    this.posts = updatePost;
  //    this.postsUpdated.next([...this.posts])
  //  })
  }
}


