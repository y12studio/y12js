'use strict';

module.exports = [{
    name: 'InvalidState',
    message: 'Invalid state: {0}'
}, {
    name: 'InvalidArgument',
    message: 'Invalid Argument {0}: {1}'
}, {
    name: 'Foo',
    message: 'Error on Foo {0}',
    errors: [{
        'name': 'UnknownCode',
        'message': 'Unrecognized foo code: {0}'
    }, {
        'name': 'UnknownCodeBlue',
        'message': 'Unrecognized foo codeblue: {0}'
    }]
}, {
    name: 'Tx',
    message: 'Internal Error on Transaction {0}',
    errors: [{
        name: 'Amount',
        message: 'Internal Error on Amount {0}'
    }, {
        name: 'NeedMoreInfo',
        message: '{0}'
    }, {
        name: 'InvalidSorting',
        message: 'The sorting function provided did not return the change output as one of the array elements'
    }, {
        name: 'InvalidOutputAmountSum',
        message: '{0}'
    }, {
        name: 'MissingSignatures',
        message: 'Some inputs have not been fully signed'
    }, {
        name: 'InvalidIndex',
        message: 'Invalid index: {0} is not between 0, {1}'
    }, {
        name: 'UnableToVerifySignature',
        message: 'Unable to verify signature: {0}'
    }, {
        name: 'DustOutputs',
        message: 'Dust amount detected in one output'
    }, {
        name: 'InvalidSatoshis',
        message: 'Output satoshis are invalid',
    }, {
        name: 'FeeError',
        message: 'Internal Error on Fee {0}',
        errors: [{
            name: 'TooSmall',
            message: 'Fee is too small: {0}',
        }, {
            name: 'TooLarge',
            message: 'Fee is too large: {0}',
        }, {
            name: 'Different',
            message: 'Unspent value is different from specified fee: {0}',
        }]
    }, {
        name: 'ChangeAddressMissing',
        message: 'Change address is missing'
    }, {
        name: 'BlockHeightTooHigh',
        message: 'Block Height can be at most 2^32 -1'
    }, {
        name: 'NLockTimeOutOfRange',
        message: 'Block Height can only be between 0 and 499 999 999'
    }, {
        name: 'LockTimeTooEarly',
        message: 'Lock Time can\'t be earlier than UNIX date 500 000 000'
    }]
}];
