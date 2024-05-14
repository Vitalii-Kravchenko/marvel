import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderList = (charList) => {
        const content = charList.map(({id, name, thumbnail}) => {
            const objectFitImg = thumbnail.slice(-23) === 'image_not_available.jpg';

            return (
                <li
                    className="char__item"
                    key={id}
                    onClick={() => this.props.onCharSelected(id)}>
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

    render() {
        const {charList, loading, error} = this.state;

        const itemsList = this.renderList(charList);

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? itemsList : null;

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;