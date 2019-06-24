document.addEventListener('DOMContentLoaded', () => {
  const navbarList = document.querySelector('.navbar_list');
  const modalWatchedButton = document.querySelector('#modal_watched_button');
  const closeModal = document.querySelector('#modal_watched_close');
  const modalWatchedCurrency = document.querySelector(
    '#modal_watched_currency'
  );
  const defaultCurrencySection = document.querySelector(
    '.default_currency_section'
  );
  const copyrightDate = document.querySelector('#copyright_date');

  let defaultCurrency, singleRateCurrency;

  const allCurrency = {
    AUD: 'Australian Dollar',
    BGN: 'Bulgarian Lev',
    BRL: 'Brazilian Real',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    CZK: 'Czech Republic Koruna',
    DKK: 'Danish Krone',
    EUR: 'Euro',
    GBP: 'British Pound Sterling',
    HKD: 'Hong Kong Dollar',
    HRK: 'Croatian Kuna',
    HUF: 'Hungarian Forint',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli New Sheqel',
    ISK: 'Icelandic Króna',
    INR: 'Indian Rupee',
    JPY: 'Japanese Yen',
    KRW: 'South Korean Won',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    NZD: 'New Zealand Dollar',
    PHP: 'Philippine Peso',
    PLN: 'Polish Zloty',
    RON: 'Romanian Leu',
    RUB: 'Russian Ruble',
    SEK: 'Swedish Krona',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    TRY: 'Turkish Lira',
    USD: 'United States Dollar',
    ZAR: 'South African Rand'
  };

  const popularCurrency = [
    'USD',
    'EUR',
    'GBP',
    'SEK',
    'AUD',
    'CAD',
    'JPY',
    'HKD',
    'NZD'
  ];

  // -------------- UI------------

  copyrightDate.textContent = new Date().getFullYear();

  if (window.innerWidth <= 640) {
    let swiper = new Swiper('.swiper-container', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      }
    });
  }

  navbarList.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('navbar_sign')) {
      const id = e.target.parentElement.getAttribute('href');
      const element = document.querySelector(id);
      if (element)
        window.scroll({ left: 0, top: element.offsetTop, behavior: 'smooth' });
    }
  });

  modalWatchedButton.addEventListener('click', e => {
    e.preventDefault();
    modalWatchedCurrency.classList.remove('modal_hidden');
  });

  closeModal.addEventListener('click', () => {
    modalWatchedCurrency.classList.add('modal_hidden');
  });

  window.addEventListener('scroll', () => {
    if (scrollY > 100) {
      defaultCurrencySection.style.transform = 'translateX(105%)';
    } else {
      defaultCurrencySection.style.transform = 'translateX(0%)';
    }
  });

  // -------------- END UI ---------------
});
