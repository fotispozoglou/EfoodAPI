class Validate {
  _value;
  _valid = true;
  _invalidMessages = [];

  constructor( value ) {

    this._value = value;

  }
  
  isValid() { return this._valid; }

  enum( enums, errorMessage ) {

    const isValid = enums.includes( this._value );

    this.handleStatement( isValid ? false : true, errorMessage );

    return this;

  }

  handleStatement( statement, errorMessage ) {

    if ( statement === true ) {

      this._valid = false;

      this._invalidMessages.push( errorMessage );

    }

  }

  min( minValue, errorMessage ) { this.handleStatement( parseInt(this._value) < minValue, errorMessage ); return this; }
  max( maxValue, errorMessage ) { this.handleStatement( parseInt(this._value) > maxValue, errorMessage ); return this; }

  required( errorMessage ) { 

    const isNotNumber = isNaN( this._value );

    const noValue = ( this._value === undefined || this._value === null );

    this.handleStatement( noValue || this._value.length <= 0, errorMessage );
    
    return this; 
  
  }

  getInvalidMessage() { return this._invalidMessages.join(','); }

}

module.exports = Validate;