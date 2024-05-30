import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit {

  permalink:any='';
  imgSrc:any="./assets/unknown.jpg";
  selectedImg:any;

  categories!:Array<any>;

  postForm!:FormGroup;

  post:any;

  formStatus:string="Add New";

  docId!:string;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val=>{
      this.categories=val;
    })
  }
  constructor(private categoryService: CategoriesService, private fb: FormBuilder, private postService: PostsService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(val => {
        this.docId = val['id'];
        if (this.docId && this.formStatus === "Add New") {
            this.postService.loadOneData(val['id']).subscribe(post => {
                this.post = post;
                this.postForm = this.fb.group({
                    title: [this.post?.title, [Validators.required, Validators.minLength(10)]],
                    permalink: [this.post?.permalink, Validators.required],
                    excerpt: [this.post?.excerpt, [Validators.required, Validators.minLength(50)]],
                    category: [`${this.post?.category?.categoryId}-${this.post?.category?.category}`, Validators.required],
                    postImg: ['', Validators.required],
                    content: [this.post?.content, Validators.required]
                });
                this.imgSrc = this.post?.postImgPath ?? "./assets/unknown.jpg";
                this.formStatus = "Edit";
            });
        }
    });

    this.postForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(10)]],
        permalink: ['', Validators.required],
        excerpt: ['', [Validators.required, Validators.minLength(50)]],
        category: ['', Validators.required],
        postImg: ['', Validators.required],
        content: ['', Validators.required]
    });
}
  get fc(){
    return this.postForm.controls
  }
  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
    setTimeout(() => {
      this.postForm.get('permalink')?.setValue(this.permalink);
    });
  }
  showPreview($event:any){
    const reader=new FileReader();
    reader.onload=(e)=>{
      this.imgSrc=e.target?.result
    }
    reader.readAsDataURL($event?.target.files[0])
    this.selectedImg=$event.target.files[0];
  }
  onSubmit(){
    console.log(this.postForm.value)
    console.log(this.postForm.value.permalink)
    let splitted=this.postForm.value.category.split("-");
    const postData:Post={
      title:this.postForm.value.title,
      permalink:this.postForm.value.permalink,
      category:{
        categoryId:splitted[0],
        category:splitted[1],
      },
      postImgPath:'',
      excerpt:this.postForm.value.excerpt,
      content:this.postForm.value.content,
      isFeatured:false,
      views:0,
      status:'new',
      createdAt:new Date()
    }
    this.postService.uploadImage(this.selectedImg,postData,this.formStatus,this.docId)
    this.postForm.reset();
    this.imgSrc="./assets/unknown.jpg";

  }
}
