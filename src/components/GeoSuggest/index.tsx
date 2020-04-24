import Geosuggest from 'react-geosuggest';

const types = ['address'];
const fields = ['geometry.location'];

export default function GeoSuggest({
  isInvalid = false,
  onSuggestSelect,
  ...rest
}) {
  return (
    <div className={`root ${isInvalid ? 'is-invalid' : ''}`}>
      <Geosuggest
        inputClassName={`form-control ${isInvalid ? 'is-invalid' : ''}`}
        country="ar"
        types={types}
        placeDetailFields={fields}
        onSuggestSelect={onSuggestSelect}
        {...rest}
      />
      <style jsx global>{`
        .root {
          flex: 1;
        }

        .geosuggest {
          font-size: 18px;
          font-size: 1rem;
          position: relative;
          width: 100%;
          text-align: left;
        }
        .geosuggest__input {
          width: 100%;
          border-radius: 0;
        }
        .geosuggest__input:focus {
        }
        .geosuggest__suggests {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          max-height: 25em;
          padding: 0;
          margin-top: -1px;
          background: #fff;
          border: 1px solid #000;
          border-top-width: 0;
          overflow-x: hidden;
          overflow-y: auto;
          list-style: none;
          z-index: 5;
          -webkit-transition: max-height 0.2s, border 0.2s;
          transition: max-height 0.2s, border 0.2s;
        }
        .geosuggest__suggests--hidden {
          max-height: 0;
          overflow: hidden;
          border-width: 0;
        }

        .geosuggest__item {
          font-size: 18px;
          font-size: 1rem;
          padding: 0.5em 0.65em;
          cursor: pointer;
        }
        .geosuggest__item:hover,
        .geosuggest__item:focus {
          background: #f5f5f5;
        }
        .geosuggest__item--active {
          background: #267dc0;
          color: #fff;
        }
        .geosuggest__item--active:hover,
        .geosuggest__item--active:focus {
          background: #ccc;
        }
        .geosuggest__item__matched-text {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
