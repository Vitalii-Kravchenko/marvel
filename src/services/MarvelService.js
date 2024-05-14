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

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&apikey=${this._apiKey}`);

        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);

        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (character) => {
        const {id, name, description, thumbnail, urls, comics} = character;

        const transformDescription = (text) => {
            if (!text) {
                return 'No Description.';
            } else if (text.length > 175) {
                return `${text.slice(0, 175)}...`;
            }

            return description;
        }

        return {
            id,
            name,
            description: transformDescription(description),
            thumbnail: thumbnail.path + '.' + thumbnail.extension,
            homepage: urls[0].url,
            wiki: urls[1].url,
            comics: comics.items
        }
    }
}

export default MarvelService;