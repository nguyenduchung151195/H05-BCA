export function whiteSpace(value) {
    const rex = /^\s+|\s$/;
    const error = rex.test(value);
    return error;
  }
  export function min(value, rest) {
    if (value.length > 0 && rest.min !== null && value.length < rest.min) {
      return true;
    }
    return false;
  }
  export function phoneNumber(value){
    const rex = /^(0|\+84)((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\d{3})(\d{3})$/;
    const error = rex.test(value);
    return error;
  }
  export function onlyVietnameses(value){
   if(value){
    const rex = /^[a-eghik-vxyA-EGHIK-VXYÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹaàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệghiìỉĩíịklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvxyỳỷỹýỵ\s]+$/;
    const error = !rex.test(value);
    return error;
   }
  }