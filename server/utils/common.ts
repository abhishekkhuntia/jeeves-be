var generateRandomIdString = function (length: number) {
    let ts = Date.now();
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text + "" + ts;
}

export const userRoles = {
    superAdmin: 'SUPER-ADMIN',
    owner: 'OWNER',
    admin: 'ADMIN',

}
export const createUserAccessMap = { // user can access or edit or create details based on the roles.
    'SUPER-ADMIN': ['OWNER', 'ADMIN', 'SUPER-ADMIN', 'CASHIER', 'CHEF'],
    'OWNER': ['ADMIN', 'CASHIER', 'CHEF'],
    'ADMIN': ['CASHIER', 'CHEF']
}
function twoDigits(d: number) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
const cleanUserData = (userData: any) => {
    if(userData){
        delete userData.authId;
        delete userData._id;
        return userData;
    }
}
const makeContactUserData = (userData: any) => {
    if(userData){
        cleanUserData(userData);
        let temp = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNo: userData.phoneNo
        }
        return temp;
    }
    return null;
}
export const methods = {
    generateRandomIdString: generateRandomIdString,
    cleanUserData,
    makeContactUserData
}
