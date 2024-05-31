import './styles.css'; // Import stylów CSS
import { Notify } from 'notiflix/build/notiflix-notify-aio'; // Import modułu Notify z biblioteki Notiflix
import debounce from 'lodash.debounce'; // Import funkcji debounce z biblioteki lodash
import { fetchCountries } from './fetchCountries'; // Import funkcji fetchCountries z pliku fetchCountries.js

const DEBOUNCE_DELAY = 300; // Opóźnienie dla funkcji debounce

// Zdefiniowanie odwołań do elementów HTML
const refs = {
  searchEl: document.querySelector('#search-box'), // Pole wyszukiwania
  countryInfo: document.querySelector('.country-info'), // Kontener dla informacji o kraju
  countryList: document.querySelector('.country-list'), // Lista krajów
};

// Funkcja do wyczyszczenia zawartości elementu HTML
const clearMarkup = ref => (ref.innerHTML = '');

// Obsługa zdarzenia input
const inputHandler = e => {
  const textInput = e.target.value.trim(); // Pobranie wartości wprowadzonej przez użytkownika

  // Sprawdzenie, czy pole wyszukiwania jest puste
  if (!textInput) {
    clearMarkup(refs.countryList); // Wyczyszczenie listy krajów
    clearMarkup(refs.countryInfo); // Wyczyszczenie informacji o kraju
    return; // Zakończenie działania funkcji
  }

  // Wywołanie funkcji fetchCountries z podanym tekstem
  fetchCountries(textInput)
    .then(data => {
      console.log(data); // Wyświetlenie danych zwróconych przez funkcję fetchCountries

      // Sprawdzenie, czy liczba znalezionych krajów jest większa niż 10
      if (data.length > 10) {
        clearMarkup(refs.countryList); // Wyczyszczenie listy krajów
        clearMarkup(refs.countryInfo); // Wyczyszczenie informacji o kraju
        Notify.info('Too many matches found. Please enter a more specific name'); // Wyświetlenie komunikatu informacyjnego
        return; // Zakończenie działania funkcji
      }

      renderMarkup(data); // Wywołanie funkcji renderMarkup z danymi krajów
    })
    .catch(err => {
      clearMarkup(refs.countryList); // Wyczyszczenie listy krajów
      clearMarkup(refs.countryInfo); // Wyczyszczenie informacji o kraju
      Notify.failure('Oops..., there is no country with that name'); // Wyświetlenie komunikatu o błędzie
    });
};

// Funkcja do renderowania listy krajów
const renderMarkup = data => {
  // Sprawdzenie, czy liczba krajów wynosi 1
  if (data.length === 1) {
    clearMarkup(refs.countryList); // Wyczyszczenie listy krajów
    const markupInfo = createInfoMarkup(data); // Wygenerowanie znaczników HTML dla informacji o kraju
    refs.countryInfo.innerHTML = markupInfo; // Wstawienie znaczników HTML do kontenera informacji o kraju
  } else {
    clearMarkup(refs.countryInfo); // Wyczyszczenie informacji o kraju
    const markupList = createListMarkup(data); // Wygenerowanie znaczników HTML dla listy krajów
    refs.countryList.innerHTML = markupList; // Wstawienie znaczników HTML do listy krajów
  }
};

// Funkcja do generowania znaczników HTML dla listy krajów
const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

// Funkcja do generowania znaczników HTML dla informacji o kraju
const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

// Dodanie nasłuchiwania zdarzenia input z wykorzystaniem funkcji debounce
refs.searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));