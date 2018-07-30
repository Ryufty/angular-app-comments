import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, take, debounceTime } from 'rxjs/operators';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

interface Post {
  title: string;
  content: string;
}

interface PostId extends Post { 
  id: string; 
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  postsCol: AngularFirestoreCollection<Post>;
  //posts: Observable<Post[]>;
  posts: any;
  todayDate: any;
 
  postDoc: AngularFirestoreDocument<Post>;
  post: Observable<Post>;

  commentForm: FormGroup;
  
  constructor (
    private afs: AngularFirestore,
    private fb: FormBuilder) {}

  ngOnInit() {
    // For setting up "CRITERIA"
    // this.postsCol = this.afs.collection('posts', ref => ref.where('title', '==', 'coursetro'));
    this.postsCol = this.afs.collection('posts');
    this.posts = this.postsCol.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;

          return { id, data };
        });
      })
    );

    this.todayDate = Date.now();

    this.commentForm = this.fb.group ({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  get title() { return this.commentForm.get('title'); }
  get content() { return this.commentForm.get('content'); }

  addPost() {
    this.afs.collection('posts').add({ 'title': this.title.value, 'content': this.content.value });
    // this.afs.collection('posts')
    //   .doc('my-custom-id')
    //   .set( {'title': this.title.value, 'content': this.content.value} );
    this.commentForm.reset();
  }

  getPost(postId) {
    this.postDoc = this.afs.doc('posts/'+postId);
    this.post = this.postDoc.valueChanges();
  }

  deletePost(postId) {
    this.afs.doc('posts/'+postId).delete();
  }

}
