const Validate = require("./Validate");

class ValidateModel extends Validate {
  _model;
  _id;
  _hasInvalidID = false;
  _invalidMessages = [];
  _valid = true;

  constructor( model, id, value ) {
    super( value );

    this._model = model;
    this._id = id;

  }

  isValid() {

    return this._valid;

  }

  getInvalidMessage() {

    return this._invalidMessages;

  }

  handleStatement( statement, errorMessage ) {

    if ( statement === true ) {

      this._valid = false;

      this._invalidMessages.push( errorMessage );

      return true;

    }

  }

  validateID( errorMessage ) {

    const hasInvalidID = this.handleStatement( this._id === undefined || this._id === null || this._id.length <= 0, errorMessage );

    if ( hasInvalidID ) this._hasInvalidID = true;

    return this;

  }

  validateIDS( errorMessage ) {

    if ( this._id.length < 1 ) return this;

    let hasInvalidID = this.handleStatement( this._id.map(id => ( id === undefined || id === null || id.length <= 0 )), errorMessage );

    if ( hasInvalidID ) this._hasInvalidID = true;

    return this;

  }

  async IDSExists( errorMessage ) {

    if ( this._hasInvalidID || this._id.length < 1 ) return this;

    let hasInvalidID = false;

    for ( const id of this._id ) {

      const exists = await this._model.exists({ _id: id });

      if ( exists === false ) hasInvalidID = true;

    }

    this.handleStatement( hasInvalidID, errorMessage );

    return this;

  }

  async exists( errorMessage ) {

    if ( this._hasInvalidID ) return this;

    const exists = await this._model.exists({ _id: this._id });

    this.handleStatement( !exists, errorMessage );

    return this;

  }

};

module.exports = ValidateModel;