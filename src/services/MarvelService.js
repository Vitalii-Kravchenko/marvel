class MarvelService {
   _apiBase = 'https://gateway.marvel.com:443/v1/public/';
   _apiKey = 'b6a19c75a2b88853dd1b6655904ec0b5';

   getResource = async (url) => {
      let res = await fetch(url);

      if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }

      return await res.json();
   }

   getAllCharacters = () => {
      return this.getResource(`${this._apiBase}characters?limit=9&offset=210&apikey=${this._apiKey}`);
   }

   getCharacters = (id) => {
      return this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
   }
}

export default MarvelService;