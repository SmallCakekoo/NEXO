export enum Comments {
  photo = "photo",
  name = "name",
  date ="date",
  degree = "degree",
  semestre = "semestre",
  comment = "comment",
  tag = "tag",
  likes = "likes",
  share = "share",
  comments = "comments",

}

class thePost extends HTMLElement {
  photo?: string;
  name?: string;
  date?:string;
  degree?: string;
  semestre?: string;
  comment?: string;
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
      justify-content: center; 
    }
    .like-container{
      display: flex; 
      align-items: center; 
      gap: 10px;
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
          font-size: 18px;
          display: inline-block;
          }

          .like-icon path {
            transition: fill 0.2s ease;
          }
          .liked path {
            fill: #5354ED;
          }

        .tag {
        display: inline-block;
        padding: 4px 12px;
        border: 2px solid blue;
        border-radius: 9999px;
        color: blue;
        background-color: white;
        font-weight: 500;
        font-size: 14px;
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
      .degree{
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

      .the-degree{
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
      }

      .just-likes{
      font-weight: bold;
      font-size: 14px; 
      }
      
      .just-share{
      font-weight: bold;
      font-size: 14px; 
      }

      .just-comments{
      font-weight: bold;
      font-size: 14px; 
      }

      .attributes-container{
      margin: 5%;
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

              <div class ="the-degree">
                <p class ="degree">${this.getAttribute("degree")}</p>
                <p class = "semestre" >${this.getAttribute("semestre")}</p>
              </div>
          </div>

        <div class ="comment-container">
         <p class = "comment">${this.getAttribute("comment")}</p>
        </div>
        
      </div>

      <p class = "tag">${this.getAttribute("tag")}</p>
        
    
        <hr>
        <div class= "footer">  
        
          <span class="like-container">
              <svg class="like-icon ${this.liked ? "liked" : ""}" width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.7464 23.2537C11.7824 22.1867 10.8249 21.1323 9.87383 20.085C7.31961 17.2723 4.81148 14.5103 2.34597 11.6898C0.773723 9.89096 0.332623 7.56671 1.1388 5.08706L1.13897 5.08653C1.59819 3.66875 2.28959 2.61501 3.14928 1.87999C4.00778 1.146 5.05873 0.708648 6.27301 0.56093L6.27324 0.560901C8.18576 0.327335 9.91152 1.01555 11.2516 2.75032L11.2517 2.75044C11.6809 3.30579 12.1673 3.76156 12.7883 3.72877C13.0931 3.71267 13.3582 3.57968 13.5865 3.40862C13.8132 3.23878 14.0345 3.00803 14.258 2.74435L14.2581 2.74424C15.5752 1.18896 17.2069 0.470129 18.7899 0.500952C20.374 0.531795 21.9713 1.31447 23.2157 2.88331C25.2234 5.41663 25.2838 9.19751 23.2151 11.5909L23.2151 11.591C20.745 14.4504 18.2166 17.2308 15.6497 20.0535C14.687 21.1121 13.7189 22.1767 12.7464 23.2537Z" stroke="#5354ED" fill="${this.liked ? "#5354ED" : "none"}"/>
              </svg>
              <p class = "just-likes">${this.getAttribute("likes")} Likes</p>
            </span>

          <span class = "like-container">
            <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_410_3007)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.856 0.147345C14.077 -0.0491149 14.41 -0.0491149 14.631 0.147345L19.881 4.81401C20.1218 5.02805 20.1435 5.39676 19.9295 5.63755C19.7155 5.87834 19.3467 5.90002 19.106 5.68599L14.2435 1.36381L9.38104 5.68599C9.14025 5.90002 8.77154 5.87834 8.55751 5.63755C8.34347 5.39676 8.36516 5.02805 8.60595 4.81401L13.856 0.147345Z" fill="#5354ED"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2435 0C14.5657 0 14.8268 0.261167 14.8268 0.583333V18.0833C14.8268 18.4055 14.5657 18.6667 14.2435 18.6667C13.9213 18.6667 13.6602 18.4055 13.6602 18.0833V0.583333C13.6602 0.261167 13.9213 0 14.2435 0Z" fill="#5354ED"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.06981 9.82494C3.3981 9.49665 3.84556 9.33325 4.32812 9.33325H8.99479C9.31696 9.33325 9.57812 9.59442 9.57812 9.91659C9.57812 10.2388 9.31696 10.4999 8.99479 10.4999H4.32812C4.11069 10.4999 3.97482 10.5699 3.89477 10.6499C3.81473 10.7299 3.74479 10.8658 3.74479 11.0833V26.2499C3.74479 26.4674 3.81473 26.6032 3.89477 26.6833C3.97482 26.7633 4.11069 26.8333 4.32812 26.8333H24.1615C24.3789 26.8333 24.5148 26.7633 24.5948 26.6833C24.6749 26.6032 24.7448 26.4674 24.7448 26.2499V11.0833C24.7448 10.8658 24.6749 10.7299 24.5948 10.6499C24.5148 10.5699 24.3789 10.4999 24.1615 10.4999H19.4948C19.1726 10.4999 18.9115 10.2388 18.9115 9.91659C18.9115 9.59442 19.1726 9.33325 19.4948 9.33325H24.1615C24.644 9.33325 25.0915 9.49665 25.4198 9.82494C25.7481 10.1532 25.9115 10.6007 25.9115 11.0833V26.2499C25.9115 26.7325 25.7481 27.1799 25.4198 27.5082C25.0915 27.8365 24.644 27.9999 24.1615 27.9999H4.32812C3.84556 27.9999 3.3981 27.8365 3.06981 27.5082C2.74152 27.1799 2.57812 26.7325 2.57812 26.2499V11.0833C2.57812 10.6007 2.74152 10.1532 3.06981 9.82494Z" fill="#5354ED"/>
              </g>
              <defs>
                <clipPath id="clip0_410_3007">
                  <rect width="28" height="28" fill="white" transform="translate(0.244141)"/>
                </clipPath>
              </defs>
            </svg>
           <p class = "just-share"> ${this.getAttribute("share")} Share</p>
          </span>

          <span class = "like-container">
          <svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M27.4925 7.03083C27.6518 7.16142 27.7441 7.35654 27.7441 7.56251V25.4375C27.7441 25.6435 27.6518 25.8386 27.4925 25.9692C27.3332 26.0998 27.1238 26.152 26.9218 26.1117L6.29681 21.9867C5.97546 21.9224 5.74414 21.6402 5.74414 21.3125V11.6875C5.74414 11.3598 5.97546 11.0776 6.29681 11.0134L26.9218 6.88836C27.1238 6.84796 27.3332 6.90025 27.4925 7.03083ZM7.11914 12.2511V20.7489L26.3691 24.5989V8.40112L7.11914 12.2511Z" fill="#5354ED"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.19863 11.5795C2.58554 11.1926 3.11291 11 3.68164 11H6.43164C6.81134 11 7.11914 11.3078 7.11914 11.6875C7.11914 12.0672 6.81134 12.375 6.43164 12.375H3.68164C3.42537 12.375 3.26524 12.4574 3.1709 12.5518C3.07656 12.6461 2.99414 12.8062 2.99414 13.0625V19.9375C2.99414 20.1938 3.07656 20.3539 3.1709 20.4482C3.26524 20.5426 3.42537 20.625 3.68164 20.625H6.43164C6.81134 20.625 7.11914 20.9328 7.11914 21.3125C7.11914 21.6922 6.81134 22 6.43164 22H3.68164C3.11291 22 2.58554 21.8074 2.19863 21.4205C1.81172 21.0336 1.61914 20.5062 1.61914 19.9375V13.0625C1.61914 12.4938 1.81172 11.9664 2.19863 11.5795Z" fill="#5354ED"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M27.0566 4.125C27.4363 4.125 27.7441 4.4328 27.7441 4.8125V28.1875C27.7441 28.5672 27.4363 28.875 27.0566 28.875C26.6769 28.875 26.3691 28.5672 26.3691 28.1875V4.8125C26.3691 4.4328 26.6769 4.125 27.0566 4.125Z" fill="#5354ED"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M26.3691 13.0625C26.3691 12.6828 26.6769 12.375 27.0566 12.375H28.4316C30.3238 12.375 31.8691 13.9203 31.8691 15.8125V17.1875C31.8691 19.0797 30.3238 20.625 28.4316 20.625H27.0566C26.6769 20.625 26.3691 20.3172 26.3691 19.9375C26.3691 19.5578 26.6769 19.25 27.0566 19.25H28.4316C29.5644 19.25 30.4941 18.3203 30.4941 17.1875V15.8125C30.4941 14.6797 29.5644 13.75 28.4316 13.75H27.0566C26.6769 13.75 26.3691 13.4422 26.3691 13.0625Z" fill="#5354ED"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.18164 22C9.56134 22 9.86914 22.3078 9.86914 22.6875V25.4375C9.86914 25.6938 9.95156 25.8539 10.0459 25.9482C10.1402 26.0426 10.3004 26.125 10.5566 26.125H17.4316C17.6879 26.125 17.848 26.0426 17.9424 25.9482C18.0367 25.8539 18.1191 25.6938 18.1191 25.4375V24.0625C18.1191 23.6828 18.4269 23.375 18.8066 23.375C19.1863 23.375 19.4941 23.6828 19.4941 24.0625V25.4375C19.4941 26.0062 19.3016 26.5336 18.9147 26.9205C18.5277 27.3074 18.0004 27.5 17.4316 27.5H10.5566C9.98791 27.5 9.46054 27.3074 9.07363 26.9205C8.68672 26.5336 8.49414 26.0062 8.49414 25.4375V22.6875C8.49414 22.3078 8.80194 22 9.18164 22Z" fill="#5354ED"/>
          </svg>
              <p class ="just-comments">${this.getAttribute("comments")} Comments</p>
        </span>

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
