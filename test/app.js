const host = "http://kino.vippo.ru/api";

const app = Vue.createApp({
  data() {
    return {
      page: "index",
      posts: [],
      post: null,
      commentText: "",
      registerUser: {
        name: null,
        login: null,
        password: null,
      },
      loginUser: {
        login: null,
        password: null,
      },
      currentUser: {
        name: null,
        token: null,
      },
      myPosts: [],

      currentPage: {
        page: null,
        post: null,
      },

      postForm: {
        name: null,
        text: null,
        page: null,
      },
    };
  },
  mounted() {
    this.getAllPosts();

    this.currentUser.name = JSON.parse(localStorage.user).username;
    this.currentUser.token = JSON.parse(localStorage.user).token;
    
    if (localStorage.page != null) {
      this.openPage(localStorage.page.page)
      this.post = localStorage.page.post
    }

  },
  methods: {
    openPage(pageName) {
      this.page = pageName;
      this.currentPage.page = pageName
      this.currentPage.post = app.post
      localStorage.page = currentPage
      if (pageName === "profile") {
        this.getMyPosts();
      }
    },

    getAllPosts() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(host + "/post", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          this.posts = result;
        })
        .catch((error) => console.error(error));
    },
    getPost(a) {
      const formdata = new FormData();
      formdata.append("id", "667");

      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(host + "/post/" + a.id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          this.post = result;
          this.openPage("post");
        })
        .catch((error) => console.error(error));
    },
    addComment(a) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer "+this.currentUser.token);

      const formdata = new FormData();
      formdata.append("text", this.commentText);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
      };

      fetch(host + "/post/"+ a.id +"/comment", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    },
    register() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        name: this.registerUser.name,
        login: this.registerUser.login,
        password: this.registerUser.password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(host + "/register", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.openPage("login");
        })
        .catch((error) => console.error(error));
    },
    login() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        login: this.loginUser.login,
        password: this.loginUser.password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(host + "/login", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          localStorage.user = result;

          this.currentUser.name = JSON.parse(localStorage.user).username;
          this.currentUser.token = JSON.parse(localStorage.user).token;

          this.currentUser.name = JSON.parse(localStorage.user).username;
          this.currentUser.token = JSON.parse(localStorage.user).token;

          this.openPage("profile");
        })
        .catch((error) => console.error(error));
    },
    getMyPosts() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + this.currentUser.token);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(host + "/my-post", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          this.myPosts = result;
        })
        .catch((error) => console.error(error));
    },
    deletePost(a) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + this.currentUser.token);

      const formdata = new FormData();

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch("http://kino.vippo.ru/api/post/" + a.id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.getMyPosts()
        })
        .catch((error) => console.error(error));
    },
    exit() {
      localStorage.removeItem('user')
      this.currentUser.name = null
      this.currentUser.token = null
      this.openPage('login')
    }
  },
}).mount("#app");
