import {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error(`Unexpected process state`);
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset,  initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
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

    return (
        <div className="char__list">
            {
                setContent(process, () => renderList(charList), newItemLoading)
            }
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