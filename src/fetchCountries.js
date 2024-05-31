// Deklaracja funkcji fetchCountries z parametrem name, który jest nazwą kraju do wyszukania
export const fetchCountries = name => {
    // Adres URL bazowy dla żądania HTTP
    const BASE_URL = 'https://restcountries.com/v3.1/name/';
    // Właściwości do filtrowania pól w odpowiedzi
    const properties = 'fields=name,capital,population,flags,languages';

    // Wykonanie żądania HTTP za pomocą metody fetch
    return fetch(`${BASE_URL}${name}?${properties}`).then(response => {
        // Sprawdzenie, czy odpowiedź jest prawidłowa
        if (!response.ok) {
            // Jeśli odpowiedź nie jest ok, zwróć błąd z odpowiednim kodem statusu
            throw new Error(response.status);
        }
        // Jeśli odpowiedź jest ok, zwróć dane w formacie JSON
        return response.json();
    });
};