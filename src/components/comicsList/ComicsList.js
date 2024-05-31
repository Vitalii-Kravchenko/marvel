import {useEffect, useRef, useState} from "react";

import useMarvelService from "../../services/MarvelService";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './comicsList.scss';


const ComicsList = () => {

    const [comics, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getComicsAll} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset,  initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getComicsAll(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderComics(comicsList) {

        const content = comicsList.map((item, i) => {
            const {title, thumbnail, price} = item;

            return (
                <li className="comics__item" key={i}>
                    <a href="#">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </a>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {content}
            </ul>
        )
    }

    const comicsList = renderComics(comics);

    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {comicsList}
            <button disabled={newItemLoading}
                    style={{'display': comicsEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}
                    className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;