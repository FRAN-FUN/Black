/**
 * @private
 * @ignore
 * @extends MessageDispatcher
 * @cat core
 */
/* @echo EXPORT */
class SplashScreen extends MessageDispatcher {
  constructor() {
    super(false);
  }

  show() {
    // @ifndef HIDE_SPLASH_SCREEN
    let duration = SplashScreen.duration * 0.001;
    let css = `#logo,#splash-screen{position:relative;box-sizing:border-box}#logo-inner,#logo-name{margin-left:auto;margin-right:auto}#splash-screen{z-index:999;top:0;left:0;width:100%;height:100%;display:block;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQYV2OUkpL6/+zZMwYpKSkGEM3IwMDwnwEJMBJUAQCLUhABUGRZzwAAAABJRU5ErkJggg==);opacity:1;animation:hide 0s ease-in ${duration}s forwards}@keyframes hide{to{opacity:0}}#logo{top:20%;left:50%;animation:fadein ${duration}s linear forwards}@keyframes fadein{0%{opacity:0}100%,40%{opacity:1}}#logo-name{width:100%;margin-top:108px}`;

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);

    let container = /** @type {HTMLElement} */ (document.getElementById(Black.instance.containerElementId));
    let oldOverflow = container.style.overflow;
    container.style.overflow = 'hidden';

    let splash = document.createElement('div');
    splash.id = 'splash-screen';
    container.appendChild(splash);

    let logo = document.createElement('div');
    logo.id = 'logo';
    splash.appendChild(logo);

    let logoInner = document.createElement('div');
    logoInner.id = 'logo-inner';
    logoInner.innerHTML = SplashScreen.SVG_LOGO;
    logo.appendChild(logoInner);

    let logoName = document.createElement('div');
    logoName.id = 'logo-name';
    logoName.innerHTML = SplashScreen.SVG_TEXT;
    logo.appendChild(logoName);

    let refresh = () => {
      let mw = splash.offsetWidth;
      let mh = splash.offsetHeight;

      let size = this.calculateAspectRatioFit(mw, mh, mw * 0.5, mh * 0.5);

      logo.style.width = `${size.width}px`;
      logo.style.height = `${size.height}px`;
      logo.style.marginLeft = `${-size.width * 0.5}px`;

      logoInner.style.width = `${Math.min(size.width, size.height)}px`;
      logoInner.style.height = `${Math.min(size.width, size.height)}px`;

      logoName.style.width = `${Math.min(size.width, size.height) * 0.9}px`;
      logoName.style.height = `${Math.min(size.width, size.height)}px`;
      logoName.style.marginTop = `${12}px`;
    };

    refresh();

    let cw = container.offsetWidth;
    let ch = container.offsetHeight;

    let handle = setInterval(x => {
      if (cw !== container.offsetWidth || ch !== container.offsetHeight) {
        cw = container.offsetWidth;
        ch = container.offsetHeight;
        refresh();
      }
    }, 1000 / 60);

    setTimeout(() => {
      clearTimeout(handle);

      style.parentNode.removeChild(style);
      splash.parentNode.removeChild(splash);

      container.style.overflow = oldOverflow;

      /**
       * Posts when splash screen is hidden.
       * @event SplashScreen#complete
       */
      this.post(Message.COMPLETE);
    }, SplashScreen.duration);
    // @endif

    // @ifdef HIDE_SPLASH_SCREEN
    this.post(Message.COMPLETE);
    // @endif
  }

  // @ifndef SPLASH_SCREEN
  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }
  // @endif
}

SplashScreen.duration = 4200;
SplashScreen.enabled = true;

// @ifndef HIDE_SPLASH_SCREEN
SplashScreen.SVG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 241.8 220.2"><defs><style>.b{fill:#f5f5f5}.c{fill:url(#a)}</style><pattern id="a" width="17.6" height="14.87" patternUnits="userSpaceOnUse" viewBox="0 0 17.6 14.9"><path fill="none" d="M0 0h17.6v14.87H0z"/><path class="b" d="M0 13.4v1.5h1.5A1.5 1.5 0 0 1 0 13.4z"/><path class="b" d="M8.8 0a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 1 1-3 0A1.5 1.5 0 0 1 8.8 0H0v13.4a1.5 1.5 0 0 1 1.5-1.5A1.5 1.5 0 0 1 3 13.4a1.5 1.5 0 0 1-1.5 1.5h4.3a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.4 1.4 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5h6a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1-1.5 1.5h5.8V0zm6.6.7a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.4 1.4 0 0 1-1.5-1.5A1.5 1.5 0 0 1 15.4.7zM.4 2.2A1.5 1.5 0 0 1 1.9.7a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5A1.5 1.5 0 0 1 .4 2.2zm1.7 5.7A1.5 1.5 0 0 1 .6 6.4a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 0 3zm2 3.8a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5zm.2-8a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.4 1.4 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5zm2.2 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm2.2 5.3a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zm1.4-8a1.5 1.5 0 0 1 3 0 1.5 1.5 0 1 1-3 0zm2.5 5.7a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.4 1.4 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5zm3 3.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.4 1.4 0 0 1-1.5 1.5zm0-5.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.4 1.4 0 0 1-1.5 1.5z"/></pattern></defs><path class="c" d="M25.8 105.2c12.1 8.8 29.7 6.7 59.8 6.8-7.9-7.3-9.1-18.7-7.1-27.3-6.6 7.3-5.1 19.3-12.8 19.4-3.4.1-6.9-4.7-8.3-10.8-5.3 9.4-12 10.7-14.7-4.5-2.3 2-3.9 8.2-9.5 6.2S26.8 81.8 30 71.3A28.3 28.3 0 0 1 14.6 61c-1.4 20.8.5 36.4 11.2 44.2zM51.9 39.9c29.7-3.6 54-22.8 69.5-26.3-.1 0-40.7-.3-72.3 1.9 6.2 3.5 10.5 16.3 2.8 24.4zM170.4 34.2c5.6-2 32.1-9.5 54.4-2.7-3-13.7-22.9-17-71.8-17.8a32.2 32.2 0 0 1 17.4 20.5zM211.3 109.3c-12.2 2.1-12.8-8.8-32.9-8.9-15.5 0-35.2 13.2-36.1 13.7h49.3c19.1 0 32.5-.6 35.5-7.3s-2.7-12.3-10.7-15.6c5.3 5.6 4.1 16.5-5.1 18.1zM66 189.2c-5.9 5-26 17.8-43.6 6.3 3.6 8.4 13.6 12.7 45.1 12-1.6-2.4-5.3-10.4-1.5-18.3zM32 161.5c7.3 7.8 18.1 2.6 33.7-6.2 10.5-6 27.5-9.9 40.6-1.1 3.7-8.7 5.4-10.9 6.7-10.6s.7 2.7 5.6 7c.4-1 3.8-7.9 3.8-12l-59.9-.8c-1.5 6.6-9.9 19-23.9 17.4-2.4-.3-2.5-11.6 2.4-16.9a36.7 36.7 0 0 0-7.4.9c-4.4 5.1-7 16.4-1.6 22.3zM150.9 148.1c23.6-.5 26 19.9 41.1 21 10.9.9 13.6-16.8 35.7-11.8-1.3-11.1-7.7-16.2-22.2-17.4 3 10.3-6.6 28.5-19.3 21.5a1.5 1.5 0 0 1-.8-1.1c-.9-11 2.8-15.8 7.5-20.7l-55.7-.7a18.5 18.5 0 0 1 3.7 12.4 20.7 20.7 0 0 1 10-3.2zM162 195.9c-3.9 3.6-3.8 9.5-2.5 12.5h4.1c0-14.8 17-12.8 21.2-.8 22.7-1.5 30.9-3.2 36-8.7s6.4-15.3 6.8-27.1c-2.6 3-9.8 14.7-10.9 16.4-17.8 26.3-39.9-5.9-54.7 7.7z"/><path class="b" d="M150 42.6c-.2 10.4-9.8 13.6-9.4-.7-16.2 1.9-14.5 8.5-13.7 9.5 4.4 5.6 29 4.5 27.3-4.3a5.7 5.7 0 0 0-4.2-4.5z"/><path class="b" d="M162.2 46.4c-1.7-15.7-17.2-18.2-28.4-15.6s-22.3 12.7-15.6 25.4 46.2 10.3 44-9.8zm-37.8 6.7c-5.4-9.7 10.6-13.4 13.2-13.8 7.5-1.3 18.2-1.2 19.6 7.6 2 13.2-28.8 13.3-32.8 6.2zM184.7 68.8c-1.1 0-1.1 3.3-5.4 12.5.3 0 5.8 0 8.6.2-.7-9.1-2.1-12.7-3.2-12.7zM162.5 82.9l7-1.1c-2.5-4.6-5.8-8.6-7 1.1zM153.1 74.5a55.8 55.8 0 0 0-7.8 2c6.4 9.4 7.4 2.2 7.8-2zM134.8 94.6c.4-.2 4.9-3.1 6.9-4.1-1.9-2-8.1-9.9-6.9 4.1zM190.9 81.8a58.3 58.3 0 0 1 9 1.5 77.7 77.7 0 0 0 .4-8.8c-1.7-.3-7.2-1.2-10.3-1.5a52 52 0 0 1 .9 8.8z"/><path class="b" d="M216.5 76.2a39.1 39.1 0 0 1-5.6 10.4c13 3 25.3 10.8 18.1 23.1-3.8 6.6-16.4 7.5-37.4 7.5l-55.4-.2a32.3 32.3 0 0 1-18.8 1.1c-6.8 1.5-18.2 3.7-28.2-3.1-30.8-.4-49.7 3.2-64.9-7.1C6.4 95.7 11.6 60.3 12 56.8c-6.4-12.5-.8-29.4 2.3-34.1S29.4 7.5 44.4 13c.2-.1 27.5-2.4 76-2.4 74.4 0 105.2.8 107.6 22.3 6 2.4 13.2 13 6.2 21 4.8 9.4.1 19.1-9.7 21.5a37.4 37.4 0 0 1 10.7 5.7c1.4-2.5 8.5-19.8 4.8-41.9-4.5-27.1-17.9-33.2-35.4-34.9C157.9 0 88.5.2 81.7.1 38.1-.3 18.2-.5 8.1 22.2-3.1 47.6-2.6 91.7 9.1 108c7.7 10.7 19.1 15.3 37.9 15.3 34.5 0 141.3 1.4 165.3 1.8 11-.3 27.9-3.4 29.3-19.7s-6.8-25.2-25.1-29.2z"/><path class="b" d="M202.7 88.6c1.3-.2 6.5-2 10.7-12.6-3-.2-6.3-.5-10.1-1.1.8 11.4-3 14-.6 13.7z"/><path class="b" d="M231.9 56c-7.6 5.5-18.2 1.8-19.8-3.4-2.6-8.6 4.4-10.9 6.7-10.6 7.7.8 7 6.1 4 8.1a1.5 1.5 0 0 1-1.9-2.4c1.8-1.3 0-2.8-2.1-2.7s-5.4 1-3.8 6.7 17.1 7.3 18.9-4.4c1-6.8-5.8-16.4-32.5-15.4a108.5 108.5 0 0 0-30.4 5.2c1.2 8.3-1.9 15.7-8.5 20.1-5.3 11.2-41.6 17.9-48.4-2.7-7.5.8-13.1 10-13.9 14.9a1.4 1.4 0 0 1-1.6 1.2c-6.5-.7-16.7 3.6-17.9 20-1.3 18.3 14.9 29.2 31.7 25.4a21.7 21.7 0 0 1-5-3.5c-5.7-.2-13.7-1.1-17.4-12.1-.6-1.7 2.1-3.2 2.9-.9 2.5 7.8 8.3 9.6 11.8 10a23.3 23.3 0 0 1-4.4-13.3c-.1-2.5 3-2 3-.2-.1 12.3 14.5 29.4 42 13 33.9-20.2 50.8-8.1 55.8-5 1.4.9 9.2 5.2 13.7.1 1.8-2 4.1-10.3-6.4-14.9-4.2 3.7-11.5 3.3-8.9-3-32.1-5.7-50.2 2.7-61.8 10.2s-16.4.3-17-2.5c-1.8-8.4 16.6-26.2 60.2-24.6 1.3-3.9 5.3-5.7 8.1.6 7.4.6 18 3.2 28.9 3.2s18.2-5.3 14-17.1z"/><path class="b" d="M176 81.3l3.8-9.1a107.7 107.7 0 0 0-23.6 1.6c-1.1 15.7-9.6 10.9-13.8 3.6-27.3 10.6-19.1 22.7-10.5 18.6-1.6-15.7 6-15 12.5-7a77.4 77.4 0 0 1 15.1-5.4c1.4-15.6 10-9.6 13.3-2.1zM65.8 101.1c5.2-.4 1.4-10.4 17-26.2 13.1-13.2-7.9-26.6-17.9-13s-4.4 39.6.9 39.2z"/><path class="b" d="M49.8 63.9c-4.7 6.2-6.6 20.2-2.4 30.6 2.9 7 6.9-1.5 9.3-5.4-1.2-8.8 0-20.5 5.2-28.1-5.6-3.5-10.1.3-12.1 2.9zM32.3 74.3c-2.4 10.4-.6 17.3 2.6 18.1s4.7-5.4 7.3-7.6c-.6-7.7.9-15.8 4.2-21.2-8.7-3.1-12.8 5.3-14.1 10.7z"/><path class="b" d="M12.2 39.9c-1.8 22.1 15.2 28 18.9 28.5 1.7-3.6 6.8-11.4 17.2-7.3 5.5-6.4 12-4.8 15.5-2.5C73.9 48.2 92 53.8 89.6 69.3a16.6 16.6 0 0 1 7.9-1.7c1.7-5.9 7.7-14.9 15.9-16.1a18.6 18.6 0 0 1 5.1-15.2c-4 1.6-20.6 10.6-28.1 12.3-1.4.3-2.4-2.4-.3-3 9.3-2.5 26.9-13.5 42.8-17.6 19.5-5.2 34.5 6.7 32.1 22.8 10.1-14.5-5.4-34.6-20.7-36.4-33.4-4.1-53.3 26.5-98.8 28.9-7 .4-11.9-2-13.7-6s-.9-9 3.7-10.6c2.1-.7 3.5 2.3 1.1 2.8s-4.9 9.2 4.8 10.7c12.7 2 14.5-14.3 7.3-21.2s-34-9.4-36.5 20.9zM108.8 156a30.1 30.1 0 0 1 6.8 8.2 45.5 45.5 0 0 1 2-10.6 17.4 17.4 0 0 1-5-5.7 47.5 47.5 0 0 0-3.8 8.1zM40.3 152.4c7.2.6 18.4-6.1 19.7-17.7-20.3-.3-20.5 13-19.7 17.7zM105.5 182.8c-9.5-20.1-30.2-13.6-46.7-2.2-14.8 10.3-29.4 7.7-35.8.1a31.5 31.5 0 0 1-4.6-32.4C5 168 14.6 187.8 24.8 193.5c18.7 10.5 37.8-5 41.6-8.5 12.4-11.2 28.8-11.8 33.4 2.2 4 12.2-7.6 21.6-15.9 18.1-10.7-4.4-6.4-13.5-3.1-15.1a7.4 7.4 0 0 1 8.7 1.9c1.2 1.3-.5 3.6-2.1 2.1s-3.5-2.1-5.1-1.3-4.3 7.6 2.6 9.6c8.9 2.6 14.7-7.1 12-14.4-3.9-10.7-15.2-8.9-19.9-6.6-14.5 7.2-12.8 30 6 30.7 23.2.9 27-19.8 22.5-29.4zM188.4 159.2c11.6 4.5 18.7-15.8 11.7-23.9-4.2 7.6-13.1 10.2-11.7 23.9z"/><path class="b" d="M191.9 172.1c-15.6-.4-20.8-23.1-41.9-20.9-24 2.5-24.8 45.6-13.1 57.6h3.1c-4.1-9.4-6.7-28.1 7.8-38.2 1.7-1.1 3.6 1.3 1.7 2.5-13.6 9.4-10.2 27.6-6.2 35.7h3.5c-4.2-8.4-3.6-21.3 2.4-27.3 18.5-18.3 44.9 16.4 57.1-.5 8-11.1 12.7-17.8 26.8-16.9a13.3 13.3 0 0 0-7-4c-19.7-4.1-20.7 12.4-34.2 12z"/><path class="b" d="M208.6 182.8c-13.7 18.8-40.7-15.8-57.2.7-5.4 5.4-5.6 18-1.2 25.1h6.1c-2-5.6.6-12.1 3.8-14.9 17.6-15 37.6 17.6 54.2-7.3 1-1.5 8.3-14.5 13.9-19.3-10.5.6-14.4 8.6-19.6 15.7z"/><path class="b" d="M238.8 151.3c-4-14.1-13.7-23-25.3-23.2-.3 0-120-1.8-163.5-1.8-40.8 0-44.9 21.4-47.3 34.2-3.8 20.4 3.9 40.1 8.9 46.1 9.4 11.4 25.3 13.6 48 13.6l128.4-.3c35.9 0 44.8-12.6 48.4-23.6 4.7-14 5.7-33.3 2.4-45zm-1.3 15.2c-1.5 1.5-3.3-.7-6.8 2.3.1 26.5-6.3 35.4-19 38.4-16.1 3.8-43.4 4.7-112.7 4.4-5.8 3.8-19.8 6.6-29-1.2-23.1.7-48.8.4-51.7-18.1-4.9-4.8-12.3-15.9-8.2-33.2 5.2-21.3 22.1-24.3 34.6-23.9 4.2-2.6 10-3.9 17-3.4 2 .2 1.4 2.5 1.3 3l59.3.8c.1-2-.9-2.5.1-3.9s8.9 1.7 11.8 4.1l61.1 1c4.2-4.3 3.6-10 9.2 0 12.4.9 25 4.3 26.3 21.8 3.7 1.8 8.1 6.4 6.7 7.9z"/><path class="b" d="M166.6 208.3l15.1-.6c-3.8-8.4-15.4-10.2-15.1.6zM113.3 166.2c-11.1-19.9-33.8-15.2-46.1-8.3-16.4 9.1-28.6 15.1-37.4 5.6-5.7-6.1-4.3-16.7-.5-23.4-12.8 6.6-13.3 28.1-4 38.6 5.7 6.5 18.5 8.7 31.8-.5 16.2-11.4 36.6-18.1 48.8-1.1 5.5 7.7 6.4 22.9-3 31.6h7.1c8-7 11.2-28.4 3.3-42.5z"/><path class="b" d="M137.7 153.6c1.7-13.2-7.4-17.4-12.4-18.8 1.6 11.6-8 17-6.8 36 4.6 13.7 2 29.9-4.4 38h19c-8.6-12.6-10-41.8 4.6-55.2z"/></svg>`;
SplashScreen.SVG_TEXT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 228.9 29"><defs><style>.a{fill:#f5f5f5}</style></defs><path class="a" d="M9.7 19a3.7 3.7 0 0 1 2.9 1.4 6 6 0 0 1 .9 3.6 4.6 4.6 0 0 1-1.4 3.8c-.9.7-2.5 1-4.7 1L0 28.7V10.1l6.6-.2a9.4 9.4 0 0 1 4.9 1c.9.7 1.4 2 1.4 3.9a5.1 5.1 0 0 1-.7 3A3.3 3.3 0 0 1 9.7 19zm-6.4-1.1h3.4a3.3 3.3 0 0 0 2.3-.6 2.5 2.5 0 0 0 .7-2.1 2.9 2.9 0 0 0-.7-2.1 5.1 5.1 0 0 0-2.6-.5H3.3zm0 8.3h3.5a3.9 3.9 0 0 0 2.6-.6c.5-.3.7-1.1.7-2.2a3 3 0 0 0-.7-2.4 3.8 3.8 0 0 0-2.7-.7H3.3zM22.9 10.1v14.3a2.1 2.1 0 0 0 .3 1.2 2.3 2.3 0 0 0 1.3.3h6.4l.2 2.6c-1.8.2-4.3.2-7.4.2s-4.2-1.2-4.2-3.8V10.1zM46.2 23.4h-6.9l-1.5 5.3h-3.5L39.9 11a1.2 1.2 0 0 1 1.2-.9h3.3a1.2 1.2 0 0 1 1.2.9l5.6 17.7h-3.5zm-.8-2.7l-1.9-6.4c-.2-1-.4-1.5-.4-1.6h-.7l-.4 1.6-1.9 6.4zM68.2 25.8l.3 2.5a18.5 18.5 0 0 1-5.7.7c-2.8 0-4.7-.7-5.8-2.1s-1.7-4-1.7-7.5.5-6 1.7-7.4 3-2.2 5.8-2.2a19.8 19.8 0 0 1 5.3.6l-.3 2.6a39.4 39.4 0 0 0-5-.2c-1.5 0-2.6.4-3.1 1.4s-.9 2.7-.9 5.2.3 4.3.9 5.2a3.2 3.2 0 0 0 3.1 1.5 37.5 37.5 0 0 0 5.4-.3zM79.1 20.3h-1.8a11.1 11.1 0 0 1 .2 1.9v6.5h-3.4V10.1h3.4v5.5a12.5 12.5 0 0 1-.2 2.1h1.8l5.1-7.6h3.7l-5 7.5a4.3 4.3 0 0 1-1.3 1.4 4.5 4.5 0 0 1 1.5 1.6l5.1 8h-3.7zM100 21.4l-3.8-1.2a5.1 5.1 0 0 1-2.8-2 5.9 5.9 0 0 1-.9-3.4c0-2 .5-3.4 1.4-4s2.6-1 5-1a24 24 0 0 1 5.8.6l-.2 2.4H99a4.7 4.7 0 0 0-2.5.4c-.4.2-.6.8-.6 1.7a2.5 2.5 0 0 0 .4 1.7 3.8 3.8 0 0 0 1.7.8l3.5 1.1a5.3 5.3 0 0 1 3 2 5.9 5.9 0 0 1 .9 3.4c0 2.1-.5 3.4-1.5 4.2s-2.7 1-5.1 1a30.8 30.8 0 0 1-6.1-.6L93 26l5.8.2a4.4 4.4 0 0 0 2.5-.5 2.2 2.2 0 0 0 .6-1.8 2.2 2.2 0 0 0-.4-1.6 3.5 3.5 0 0 0-1.5-.9zM126 10.1h3.5a1.2 1.2 0 0 1 1.3 1.4l.8 17.2h-3.3l-.7-15.8h-.5l-3.2 12.3a1.3 1.3 0 0 1-1.4 1.1H120a1.4 1.4 0 0 1-1.5-1.1l-3.2-12.3h-.5l-.6 15.8h-3.3l.7-17.2c.1-.9.5-1.4 1.4-1.4h3.5a1.2 1.2 0 0 1 1.3 1.2l2.7 10 .5 2.6h.4a26.1 26.1 0 0 1 .6-2.6l2.6-10a1.4 1.4 0 0 1 1.4-1.2zM141.4 28.7H138V10.1h3.4zM161.5 13h-5.7v15.7h-3.4V13h-5.7v-2.9h14.8zM180.9 10.1v18.6h-3.4v-8.5h-7.3v8.5h-3.4V10.1h3.4v7.3h7.3v-7.3zM196 13.1l-.2-2.6a24.4 24.4 0 0 1 5.9-.7 8.9 8.9 0 0 1 4.5.9 3.5 3.5 0 0 1 1.5 3.3 6.4 6.4 0 0 1-.7 3.1 13.3 13.3 0 0 1-2.4 3.3l-4.9 5.3 2.8-.2h5.8v3.2h-12.7v-2a2 2 0 0 1 .5-1.4l4.9-5.4c2.2-2.4 3.3-4.2 3.3-5.6a1.3 1.3 0 0 0-.7-1.3 5.7 5.7 0 0 0-2.2-.3 52.9 52.9 0 0 0-5.4.4zM214.3 28.7V10.1l7-.2c2.8 0 4.8.7 5.9 2.1s1.7 3.8 1.7 7.4-.6 6.1-1.7 7.5-3.1 2-5.9 2-4.5 0-7-.2zm3.4-16v13.4h3.6a3.6 3.6 0 0 0 3.2-1.4 12.6 12.6 0 0 0 .8-5.3c0-2.5-.3-4.3-.9-5.3a3.3 3.3 0 0 0-3.1-1.4h-3.6zM.1 8.1v-8h2.7a2.9 2.9 0 0 1 2.1.5 3 3 0 0 1 .5 2 2.9 2.9 0 0 1-.5 1.9 2.5 2.5 0 0 1-1.9.6H1.2v3zm1.1-4h1.6a1.6 1.6 0 0 0 1.1-.3 2.1 2.1 0 0 0 .3-1.2 2.3 2.3 0 0 0-.3-1.3A1.6 1.6 0 0 0 2.8 1H1.2zM9.7 0a3 3 0 0 1 2.5.9 5.2 5.2 0 0 1 .7 3.2 5 5 0 0 1-.7 3.2 3 3 0 0 1-2.5.9 2.8 2.8 0 0 1-2.4-.9 5 5 0 0 1-.7-3.2A5.2 5.2 0 0 1 7.3.9 2.8 2.8 0 0 1 9.7 0zm1.6 1.7A1.7 1.7 0 0 0 9.7 1a1.6 1.6 0 0 0-1.5.7 4.5 4.5 0 0 0-.4 2.4 4.5 4.5 0 0 0 .4 2.4 1.6 1.6 0 0 0 1.5.7 1.7 1.7 0 0 0 1.6-.7 4.5 4.5 0 0 0 .4-2.4 4.5 4.5 0 0 0-.4-2.4zM24.2.1l-1.6 7.6a.4.4 0 0 1-.4.4h-1.3a.4.4 0 0 1-.4-.4l-1.2-5.8a3.4 3.4 0 0 1-.1-.9h-.3l-.2.9-1.1 5.8V8h-1.7c-.3 0-.4-.1-.5-.4L13.9.1h1.2l1.2 6.1a5.1 5.1 0 0 0 .1 1h.3c0-.3.1-.7.1-1L18 .5a.4.4 0 0 1 .4-.4h1.3a.2.2 0 0 1 .2.2.2.2 0 0 1 .2.2l1.1 5.7c.1.3.1.6.2 1h.3v-.5a1.1 1.1 0 0 0 .1-.5L22.9.1zM30.3 7.1V8H27a1.6 1.6 0 0 1-1.2-.4 1.2 1.2 0 0 1-.4-1v-5a1.4 1.4 0 0 1 .4-1.1A2.1 2.1 0 0 1 27 .1h3.4V1h-3.2l-.5.2a.7.7 0 0 0-.1.5v1.7h3.3v1h-3.3v2a1.1 1.1 0 0 0 .1.6h3.6zM37.6 8.1h-1.2l-.7-2.5a1.1 1.1 0 0 0-1-.8h-1.6v3.3h-1.2v-8h2.8a3.4 3.4 0 0 1 2 .5 2.4 2.4 0 0 1 .6 1.8 2.8 2.8 0 0 1-.3 1.4 2 2 0 0 1-1.2.6 1.4 1.4 0 0 1 1 1.2zm-4.5-4.3h1.6a1.6 1.6 0 0 0 1.1-.3 1.4 1.4 0 0 0 .3-1.1 1.6 1.6 0 0 0-.3-1.1 1.6 1.6 0 0 0-1.1-.3h-1.6zM43.9 7.1V8h-3.3a1.6 1.6 0 0 1-1.2-.4 1.2 1.2 0 0 1-.4-1v-5a1.4 1.4 0 0 1 .4-1.1 2.1 2.1 0 0 1 1.2-.4H44V1h-3.2a.6.6 0 0 0-.5.2.8.8 0 0 0-.2.5v1.7h3.4v1h-3.4v2a1.1 1.1 0 0 0 .2.6h3.6zM45.5 8.1v-8h2.9a3 3 0 0 1 2.4.9 5.2 5.2 0 0 1 .7 3.2 5.2 5.2 0 0 1-.7 3.2 3 3 0 0 1-2.4.9zm1.1-7v6h1.8a1.6 1.6 0 0 0 1.5-.7 5.7 5.7 0 0 0 .4-2.4 6.5 6.5 0 0 0-.4-2.4 1.8 1.8 0 0 0-1.5-.6h-1.8zM59.6 3.9a1.5 1.5 0 0 1 1.3.6 2.8 2.8 0 0 1 .3 1.5 2.2 2.2 0 0 1-.5 1.6 3.4 3.4 0 0 1-2 .5h-3v-8h2.6a3.7 3.7 0 0 1 2.1.4 1.8 1.8 0 0 1 .6 1.6 2.3 2.3 0 0 1-.3 1.3 1.4 1.4 0 0 1-1.1.5zm-2.8-.4h1.6a2.9 2.9 0 0 0 1.2-.2 1.3 1.3 0 0 0 .3-1c0-.5-.1-.9-.4-1a1.7 1.7 0 0 0-1.2-.3h-1.5zm0 3.7h1.7a1.7 1.7 0 0 0 1.2-.3c.3-.1.4-.5.4-1a1.7 1.7 0 0 0-.4-1.2 1.9 1.9 0 0 0-1.3-.3h-1.6zM65.6 5.3v2.8h-1.1V5.3L61.8.1h1.3l1.6 3.3a4.2 4.2 0 0 0 .3.9h.1a8.5 8.5 0 0 1 .3-.9L67 .1h1.2z"/></svg>`;
// @endif