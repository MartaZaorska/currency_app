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

  copyrightDate.textContent = new Date().getFullYear();

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

  function getPopularOrWatchedCurrency() {
    const watchedCurrency = JSON.parse(localStorage.getItem('watchedCurrency'));
    if (
      localStorage.getItem('watchedCurrency') === null ||
      watchedCurrency.length === 0
    ) {
      return popularCurrency;
    } else {
      return watchedCurrency;
    }
  }

  function getStartAndEndDate(time) {
    const to = new Date();
    const from = new Date(to.getTime() - time);
    const start = `${from.getFullYear()}-${from.getMonth() +
      1}-${from.getDate()}`;
    const end = `${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}`;
    return [start, end];
  }

  function sortData(data) {
    return Object.entries(data).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });
  }

  function getCurrencyRate(path) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.exchangeratesapi.io${path}`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function setCurrencySelectList(id, currencyArray, selected = undefined) {
    const elementHTML = document.querySelector(`#${id}`);
    currencyArray.forEach(currency => {
      const option = document.createElement('option');
      option.setAttribute('value', currency);
      if (selected === currency) option.setAttribute('selected', true);
      option.appendChild(document.createTextNode(currency));
      elementHTML.appendChild(option);
    });
  }

  async function setDefaultCurrency() {
    if (localStorage.getItem('defaultCurrency') === null) {
      const language =
        navigator.language.indexOf('-') === -1
          ? navigator.language
          : navigator.language.split('-')[0];
      await fetch(`https://restcountries.eu/rest/v2/alpha/${language}`)
        .then(res => res.json())
        .then(data => {
          defaultCurrency = allCurrency[data.currencies[0].code]
            ? new Watched(data.currencies[0].code)
            : new Watched('EUR');
          localStorage.setItem('defaultCurrency', defaultCurrency.value);
        })
        .catch(err => console.log(err));
    } else {
      defaultCurrency = new Watched(localStorage.getItem('defaultCurrency'));
    }
    addFeaturesDefaultCurrency();
  }

  function addFeaturesDefaultCurrency() {
    if (defaultCurrency) {
      setCurrencySelectList(
        'default_currency',
        Object.keys(allCurrency),
        defaultCurrency.value
      );
      document
        .querySelector('#default_currency')
        .addEventListener(
          'change',
          e => (defaultCurrency.value = e.target.value)
        );
      defaultCurrency.addSubscriber(setCurrentRateCards);
      defaultCurrency.addSubscriber(setRateSectionData);
    }
  }

  function setWatchedCurrency() {
    const watchedCurrencySelect = document.querySelector(
      '#watched_currency_select'
    );
    const addCurrencyButton = document.querySelector('#add_watched_currency');
    setCurrencySelectList(
      'watched_currency_select',
      Object.keys(allCurrency),
      'EUR'
    );

    setWatchedCurrencyList();

    addCurrencyButton.addEventListener('click', e => {
      e.preventDefault();
      let watchedCurrency = [];
      if (localStorage.getItem('watchedCurrency') === null) {
        watchedCurrency.push(watchedCurrencySelect.value);
      } else {
        watchedCurrency = JSON.parse(localStorage.getItem('watchedCurrency'));
        if (watchedCurrency.indexOf(watchedCurrencySelect.value) === -1)
          watchedCurrency.push(watchedCurrencySelect.value);
      }
      localStorage.setItem('watchedCurrency', JSON.stringify(watchedCurrency));
      setCurrentRateCards();
      setWatchedCurrencyList();
    });
  }

  function setWatchedCurrencyList() {
    const watchedCurrencyList = document.querySelector(
      '#watched_currency_list'
    );
    const watchedCurrency = JSON.parse(localStorage.getItem('watchedCurrency'));
    if (
      localStorage.getItem('watchedCurrency') === null ||
      watchedCurrency.length === 0
    ) {
      watchedCurrencyList.innerHTML =
        '<p class="modal_subtitle">Brak obserwowanych walut</p>';
    } else {
      watchedCurrencyList.innerHTML =
        '<p class="modal_subtitle">Waluty obserwowane</p>';
      watchedCurrency.forEach(currency => {
        const element = document.createElement('span');
        element.appendChild(document.createTextNode(currency));
        element.className = 'watched_item';
        const deleteElement = document.createElement('i');
        deleteElement.className = 'fas fa-times';
        deleteElement.addEventListener('click', () =>
          deleteWatchedCurrency(currency)
        );
        element.appendChild(deleteElement);
        watchedCurrencyList.appendChild(element);
      });
    }
  }

  function deleteWatchedCurrency(symbol) {
    const watchedCurrency = JSON.parse(localStorage.getItem('watchedCurrency'));
    const index = watchedCurrency.findIndex(item => item === symbol);
    watchedCurrency.splice(index, 1);
    localStorage.setItem('watchedCurrency', JSON.stringify(watchedCurrency));
    setCurrentRateCards();
    setWatchedCurrencyList();
  }

  function setCurrentRateCards() {
    const cardsElement = document.querySelector('#current_rate_cards');
    const cardsTitleElement = document.querySelector('#current_rate_title');
    const currency = getPopularOrWatchedCurrency().filter(
      item => item != defaultCurrency.value
    );

    getCurrencyRate(
      `/latest?base=${defaultCurrency.value}&symbols=${currency.join(',')}`
    ).then(data => {
      cardsTitleElement.innerHTML = `<span class="text_muted">Aktualizacja ${
        data.date
      }</span><br />Kurs dla <span class="text_green">1 ${
        defaultCurrency.value
      }</span>`;
      cardsElement.innerHTML = '';
      Object.entries(data.rates).forEach(rate => {
        cardsElement.innerHTML += `
          <div class="swiper-slide">
            <span class="rate_symbol">${rate[0]}</span>
            <span class="rate_name">${allCurrency[rate[0]]}</span>
            <span class="rate_value">${rate[1].toFixed(5)}</span>
          </div>
        `;
      });
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
    });
  }

  function setSingleRateCurrency() {
    const rateSelect = document.querySelector('#rate_select');
    singleRateCurrency = new Watched('USD');
    setCurrencySelectList(
      'rate_select',
      Object.keys(allCurrency),
      singleRateCurrency.value
    );
    singleRateCurrency.addSubscriber(setRateSectionData);
    rateSelect.addEventListener(
      'change',
      e => (singleRateCurrency.value = e.target.value)
    );
  }

  function setRateSectionData() {
    document.querySelector('#rate_default_currency').textContent =
      defaultCurrency.value;
    if (singleRateCurrency.value !== defaultCurrency.value) {
      const [start, end] = getStartAndEndDate(950400000);
      getCurrencyRate(
        `/history?start_at=${start}&end_at=${end}&base=${
          defaultCurrency.value
        }&symbols=${singleRateCurrency.value}`
      ).then(data => {
        showRateResult(data);
        generateChart(data);
      });
    } else {
      const rateResult = document.querySelector('#rate_result');
      rateResult.innerHTML = `
        <h1 class="text_green rate_value">1.0000</h1>
        <p class="rate_symbol">${singleRateCurrency.value}</p>
        <p class="rate_name">${allCurrency[singleRateCurrency.value]}</p>
      `;
      const rateChart = document.querySelector('#rate_chart').getContext('2d');
      const chart = new Chart(rateChart, {});
    }
  }

  function showRateResult(data) {
    const rateResult = document.querySelector('#rate_result');
    const currentRate = sortData(data.rates).pop();
    rateResult.innerHTML = `
      <h1 class="text_green rate_value">${currentRate[1][
        singleRateCurrency.value
      ].toFixed(5)}</h1>
      <p class="rate_symbol">${singleRateCurrency.value}</p>
      <p class="rate_name">${allCurrency[singleRateCurrency.value]}</p>
    `;
  }

  function generateChart(data) {
    const rateChart = document.querySelector('#rate_chart').getContext('2d');
    const rates = sortData(data.rates);
    const labels = rates.map(item => item[0]);
    const dataArray = rates.map(item => item[1][singleRateCurrency.value]);
    const backgroundColor = 'rgba(109, 192, 94, 0.5)';
    const chart = new Chart(rateChart, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: dataArray,
            label: `1 ${defaultCurrency.value} dla ${singleRateCurrency.value}`,
            backgroundColor
          }
        ]
      },
      options: {
        legend: {
          display: false
        }
      }
    });
  }

  function setConversionSectionData() {
    const conversionFromSelect = document.querySelector('#conversion_from');
    const conversionToSelect = document.querySelector('#conversion_to');
    setCurrencySelectList(
      'conversion_from',
      Object.keys(allCurrency),
      defaultCurrency.value
    );
    setCurrencySelectList('conversion_to', Object.keys(allCurrency), 'USD');
    conversionFromSelect.addEventListener('change', setResultConversion);
    conversionToSelect.addEventListener('change', setResultConversion);
    document
      .querySelector('#conversion_value')
      .addEventListener('input', setResultConversion);
    document.querySelector('#toggle_currency').addEventListener('click', () => {
      const indexFrom = conversionFromSelect.selectedIndex;
      conversionFromSelect.selectedIndex = conversionToSelect.selectedIndex;
      conversionToSelect.selectedIndex = indexFrom;
      setResultConversion();
    });
  }

  function setResultConversion() {
    const conversionFromSelect = document.querySelector('#conversion_from');
    const conversionToSelect = document.querySelector('#conversion_to');
    const conversionValue = document.querySelector('#conversion_value');
    const conversionResult = document.querySelector('#conversion_result');
    if (conversionFromSelect.value !== conversionToSelect.value) {
      getCurrencyRate(
        `/latest?base=${conversionFromSelect.value}&symbols=${
          conversionToSelect.value
        }`
      ).then(data => {
        const value =
          conversionValue.value === ''
            ? data.rates[conversionToSelect.value].toFixed(2)
            : (
                parseFloat(conversionValue.value) *
                data.rates[conversionToSelect.value]
              ).toFixed(2);
        conversionResult.innerHTML = `<span class="text_green">
          ${conversionValue.value || 1} ${
          conversionFromSelect.value
        } = ${value} ${
          conversionToSelect.value
        }</span> <br/> <span class="section_info">Aktualizacja ${
          data.date
        }</span>
        `;
      });
    } else {
      conversionResult.innerHTML = `<span class="text_green">
          ${conversionValue.value} ${conversionFromSelect.value} = ${
        conversionValue.value
      } ${conversionToSelect.value}</span>
      `;
    }
  }

  async function init() {
    await setDefaultCurrency();
    await setWatchedCurrency();
    await setCurrentRateCards();
    await setSingleRateCurrency();
    await setRateSectionData();
    await setConversionSectionData();
  }

  init();
});
