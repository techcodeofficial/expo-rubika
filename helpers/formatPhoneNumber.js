const formatPhoneNumber = phoneNumber => {
    phoneNumber = String(phoneNumber);
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedNumber.length == 10) {
        return "98" + cleanedNumber;
    } else if (cleanedNumber.length == 11 && cleanedNumber.startsWith("0")) {
        return "98" + cleanedNumber.substring(1);
    } else if (cleanedNumber.length == 12 && cleanedNumber.startsWith("98")) {
        return cleanedNumber;
    } else {
        return false;
    }
};
export default formatPhoneNumber;
