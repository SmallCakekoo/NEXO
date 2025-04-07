export enum Comments {
  photo = "photo",
  name = "name",
  date ="date",
  career = "career",
  semestre = "semestre",
  message = "message",
  tag = "tag",
  likes = "likes",
  share = "share",
  comments = "comments",

}

class thePost extends HTMLElement {
  photo?: string;
  name?: string;
  date?:string;
  career?: string;
  semestre?: string;
  message?: string;
  tag?: string;
  likes?: number;
  share?: string;
  comments?: string;
  liked: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): string[] {
    return Object.values(Comments);
  }

  attributeChangedCallback(
    propName: Comments,
    oldValue: string | number,
    newValue: string | number
  ) {
    switch (propName) {
      case Comments.likes:
        this.likes = newValue ? Number(newValue) : 0;
        break;

      default:
        if (typeof newValue === "string") {
          this[propName] = newValue;
        }
        break;
    }

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
    
     <style>
    .post{
    padding:1%;
    border:2px solid rgba(0, 0, 0, 0.56);
    width:45vw; 
    border-radius: 13px;   
    }
    .footer{
      display: flex; 
      gap: 50px;
      justify-content: justify; 
      margin-bottom: 3%; 
      margin-left: 3%
    }

    .message-container{
    font-size: 0.95rem
    }
    .like-container{
      display: flex; 
      align-items: center; 
      gap: 10px;
      align-items: flex-button;
      border: none; 
      background: none; 
      }
    .profile-picture{
         
         border-radius: 50%;
         width: 50px;
         height: 50px;
         object-fit: cover;
         }

          .name{
          color: black;
          font-weight: bold;
          magin: 0; 
          font-size: 1rem;
          display: inline-block;
          }

          .like-icon path {
            color: #6b7280;
            transition: fill 0.2s ease;
            isplay: flex;
            align-items: center;
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            font-size: 0.9rem;
            padding: 5px 10px;

          }
          .liked path {
            fill: #5354ED;
          }
          
          .likes-count{
          margin-bottom:0.5rem;
          }
          
        .tag {
        display: inline-block;
        padding: 4px 12px;
        border: 2px solid rgba(31, 31, 241, 0.57);
        border-radius: 9999px;
        color:  rgba(31, 31, 241, 0.57);
        background-color:rgb(255, 255, 255);
        font-weight: 500;
        font-size: 0.70rem;
        text-align: center;
        margin-left: 5%;
        }     
        .user-container{
          display: flex;
          align-items: flex-start;
          gap: 12px;
          justify-content: space-between; 
        }
      .profile-container{
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0;
          margin: 0;
      }
      .career{
       color: black;
      font-weight: bold;
      align-items: flex-start;
      padding: 0;
      margin: 0; 
      }

      .semestre{
       color: black;
      font-weight: bold;
      padding: 0;
      margin: 0;
      }

      .the-career{
        display: flex;
        gap: 8px;
        justify-content: space-between;   
        font-size: 14px;
        margin-top: 1.5%; 
      }

      .name-container{
        display: flex;
        flex-direction: column;
        line-height: 1%;
        gap: 0; 
        margin: 0; 
        padding: 0; 
        align-items: flex-start;
            
    }
      .date{
      display: inline-block;
      transform: translateY(-10px);
      font-size: 0.95rem;
      color: #666;
      }

    
     .just-likes {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      font-size: 0.85rem;
      padding: 5px 10px;
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
          }
  
    .just-share{
      font-weight: bold;
      font-size: 80%; 
      margin-bottom: 3%; 
      }

      .just-message{
      font-weight: bold;
      font-size: 80%; 
      margin-bottom: 3%; 
      }

      .attributes-container{
      margin: 5%;
    }

      hr{
      margin: 1% 5%; 
      }
        </style>

      <div class="post">

        <div class = "attributes-container">
        
          <div class = "user-container"> 
              <div class = "profile-container">
                <img class = "profile-picture" src = "${this.getAttribute("photo")}" alt="Profile Picture"></img>
                  <div class = "name-container">
                    <p class ="name" >${this.getAttribute("name")}</p>
                    <p class = "date" >${this.getAttribute("date")}</p>
                  </div>
              </div>

              <div class ="the-career">
                <p class ="career">${this.getAttribute("career")}</p>
                <p class = "semestre" >${this.getAttribute("semestre")}</p>
              </div>
          </div>

        <div class ="message-container">
         <p class = "message">${this.getAttribute("message")}</p>
        </div>
        
      </div>

      <p class = "tag">${this.getAttribute("tag")}</p>
        
    
        <hr>
        <div class= "footer">  
          <div class= "align-likes">
            <button class ="just-likes">
            <svg class=" like-icon ${this.liked ? "liked" : ""}" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
              C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <p class ="likes-count">${this.getAttribute("likes")} Likes</p>
          </button>
          </div>  
        

          
        </div>
      </div>
    `;

      const likeIcon = this.shadowRoot.querySelector(".like-icon");
      likeIcon?.addEventListener("click", () => {
        this.liked = !this.liked;
        this.render();
      });
    }
  }
}

export default thePost;

