class Navbar extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<nav class="navbar">
      <div class="navbar-left">
        <button class="nav-button" onclick="location.href='/index.html'">HOME</button>
      </div>
      <div class="navbar-center">
        <button class ="nav-button" onclick="location.href='/src/pages/portfolio.html'">PORTFOLIO</button>
        <button class ="nav-button">BUTTON 1</button>
      </div>
    </nav>`;
    }
}
customElements.define('site-navbar', Navbar);