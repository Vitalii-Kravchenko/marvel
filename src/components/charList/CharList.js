import {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        onCharListLoading();

        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const charItemRefs = useRef([]);

    const setCharItemFocus = (id) => {
        charItemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        charItemRefs.current[id].classList.add('char__item_selected');
        charItemRefs.current[id].focus();
    }


    function renderList(charList) {
        const content = charList.map(({id, name, thumbnail}, i) => {
            const objectFitImg = thumbnail.slice(-23) === 'image_not_available.jpg';

            return (
                <li
                    className="char__item"
                    key={id}
                    ref={el => charItemRefs.current[i] = el}
                    tabIndex={0}
                    onClick={(e) => {
                        props.onCharSelected(id)
                        setCharItemFocus(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            props.onCharSelected(id)
                            setCharItemFocus(i)
                        }
                    }}>
                    <img
                        src={thumbnail}
                        alt={name}
                        style={objectFitImg ? {'objectFit': 'contain'} : null}
                    />
                    <div className="char__name">{name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {content}
            </ul>
        );
    }

    const itemsList = renderList(charList);

    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error) ? itemsList : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {content}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;