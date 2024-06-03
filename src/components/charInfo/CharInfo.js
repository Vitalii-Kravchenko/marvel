import {useState, useEffect} from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";

import setContent from "../../utils/setContent";

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();

        const {charId} = props;

        if (!charId) {
            return
        }

        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    const objectFitImg = thumbnail.slice(-23) === 'image_not_available.jpg';

    return (
        <>
            <div className="char__basics">
                <img
                    src={thumbnail}
                    alt={name}
                    style={objectFitImg ? {'objectFit': 'contain'} : null}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.length === 0 ? 'No comics found.' : comics.map((comic, i) => {
                        // eslint-disable-next-line
                        if (i >= 10) return;

                        return (
                            <li key={i} className="char__comics-item">
                                {comic.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number,
}

export default CharInfo;