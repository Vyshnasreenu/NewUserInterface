class CMS {
    constructor() {
        // super();
        this.state = {
            value: ""
        }
    }


    isUndefinedOrNull = (value) => value === undefined || value === null

    isNullOrEmpty = (value) => this.isUndefinedOrNull(value) || value.toString() === "";


    checkPasswordValidation = (value) => {
        const isWhitespace = /^(?=.*\s)/;
        if (isWhitespace.test(value)) {
            return "Password must not contain Whitespaces.";
        }


        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(value)) {
            return "Password must have at least one Uppercase Character.";
        }


        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(value)) {
            return "Password must have at least one Lowercase Character.";
        }


        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(value)) {
            return "Password must contain at least one Digit.";
        }


        const isContainsSymbol =
            /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(value)) {
            return "Password must contain at least one Special Symbol.";
        }


        const isValidLength = /^.{10,16}$/;
        if (!isValidLength.test(value)) {
            return "Password must be 10-16 Characters Long.";
        }
        return null;
    }

    checkPasswordMatchOrNot = (enter, ReEnter) => {
        if (!this.isUndefinedOrNull(enter) && !this.isUndefinedOrNull(ReEnter)) {
            if (enter !== ReEnter || enter.length !== ReEnter.length) {
                return { content: "Password doesn't match", check: false }
            }
        }
        return { check: true }
    }


}
export default new CMS();