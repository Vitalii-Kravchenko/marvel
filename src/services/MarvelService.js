import {useHttp} from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'b6a19c75a2b88853dd1b6655904ec0b5';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apiKey}`);

        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?apikey=${_apiKey}`);

        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (character) => {
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

    return {loading, error, getAllCharacters, getCharacter, clearError}
}

export default useMarvelService;