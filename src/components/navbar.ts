class Navbar extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<nav class="navbar">
      <div class="navbar-left">
        <button class="nav-button" onclick="location.href='${import.meta.env.BASE_URL}index.html'">HOME</button>
      </div>
      <div class="navbar-center">
        <button class ="nav-button" onclick="location.href='${import.meta.env.BASE_URL}src/pages/portfolio.html'">PORTFOLIO</button> 
      </div>
      <div class = "navbar-right">
        <a href="https://www.linkedin.com/in/ryjohn/"> <i class="fa-brands fa-linkedin"></i></a>
        <a href ="https://github.com/OpusTheMoose/"><i class="fa-brands fa-github"></i></a>
      </div>
    </nav>`;
    }
}
customElements.define('site-navbar', Navbar);