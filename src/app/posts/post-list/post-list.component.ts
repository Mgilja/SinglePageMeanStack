import { Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthserviceService } from 'src/app/auth/authservice.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit, OnDestroy {
 
 constructor(public postService: PostsService, private authService: AuthserviceService ) { }

 posts: Post[] = [];
 isLoading = false;
 totalPosts = 10;
 postsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 5, 10];
 userId:string;
 private postsSub : Subscription;
 userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  ngOnInit(): void {
    this.isLoading = true
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId()
    this.postsSub = this.postService.getPostUpdateListener().subscribe((postData:{ posts: Post[], postCount: any}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount
      this.posts = postData.posts;
    
    })
    this.userIsAuthenticated = this.authService.getAuthCheck();
    //status checker
    this.authListenerSubs = this.authService.getAuthStatus().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated
        this.userId = this.authService.getUserId()
       
    })
    
};

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    
  }
  onDelete(postId:string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
        this.postService.getPosts(this.postsPerPage, this.currentPage)
    })
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

}
