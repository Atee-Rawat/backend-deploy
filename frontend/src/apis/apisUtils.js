export const BASEURL = `${process.env.REACT_APP_API_BASE_URL}`;



export const REGISTER = `${BASEURL}/user/signup`;
export const LOGIN=`${BASEURL}/user/signin`;



export const ADDPRODUCT =`${BASEURL}/product/add`;
export const GETALLPRODUCT =`${BASEURL}/product/list`;
export const UPDATEPRODUCT = (productID) => `${BASEURL}/product/update/${productID}`;
export const DELETEPRODUCT = (productID) => `${BASEURL}/product/delete/${productID}`;

