class Navbar extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<nav class="navbar">
      <div class="navbar-left">
        <button class="nav-button" onclick="location.href='${import.meta.env.BASE_URL}/index.html'">HOME</button>
      </div>
      <div class="navbar-center">
        <button class ="nav-button" onclick="location.href='${import.meta.env.BASE_URL}src/pages/portfolio.html'">PORTFOLIO</button>
        <button class ="nav-button">RESUME</button>
        <button class ="nav-button">PHOTOGRAPHY</button>
      </div>
      <div class = "navbar-right">
        <i class="fa-brands fa-linkedin"></i>
        <i class="fa-brands fa-github"></i>
      </div>
    </nav>`;
    }
}
customElements.define('site-navbar', Navbar);