import React from 'react';
import PropTypes from 'prop-types';
import {BigNumber} from 'bignumber.js';

export const currencyStr = (currency, decimals) => {
    if (!currency) {
        return '0.0'
    }
    const number = '' + BigNumber(currency).div(10 ** decimals).toFixed(decimals);
    let i = number.length - 1;
    while (number.charAt(i) === '0' && number.charAt(i) !== '.') i--;
    const converted = number.substr(0, i + 1);
    return converted + (converted.indexOf('.') === converted.length - 1 ? '0' : '');
};


class AmountView extends React.PureComponent {

    render() {
        const {className, value, currency, decimals} = this.props;
        return (
            <span className={className}>{currencyStr(value, decimals)} {currency}</span>
        );
    }
}

AmountView.propTypes = {
    className: PropTypes.string,
    value: PropTypes.any,
    currency: PropTypes.string,
    decimals: PropTypes.number
};

AmountView.defaultProps = {
    decimals: 18
};

export default AmountView;