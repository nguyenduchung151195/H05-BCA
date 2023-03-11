const checkValidation = (field, value) => {

}

const checkValidNumber = (e) => {
  if (["e", "+", "-", "."].includes(e.key)) e.preventDefault();
};

export const checkValidEmail = (value) => {
  const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEmail.test(value) === false) {
    return 'Sai định dạng Email';
  } else {
    return '';
  }

}
const checkValidStringSpecial = (field, value) => {

  const partent = /[~!@#$%^&*()?><\\|":',.]/g;
  if (Array.isArray(value.match(partent)) && value.match(partent) > 0) {
    return false;
  }
  return true;
};

export const getShortNote = (value, length) => {
  if (value.length >= length) {
    let arrayStr = ([...value])
    arrayStr = arrayStr.slice(0, length).join('');
    return arrayStr + '...'
  }
  return value
}

export function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ", "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỔỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ"
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str =str ?  str.replace(re, char) :"";
  }
  return str;
}

export function removeSpaceStr(str) {
  let result = str && str.split(' ');
  return result.join('');
}

export const checkCanProcess = (templates, data) => {
  if (data && templates) {
    return true;
  }
  return false;
  // let result = false;
  // if (templates) {
  //     templates.map(temp => {
  //         if (temp.children) {
  //             let find = temp.children && temp.children.find(f => f.code === profile.roleGroupSource);

  //             if (find) {
  //                 if (!find.children) {
  //                     result = false;
  //                 }
  //                 if (find.children && find.children.length === 0) {
  //                     result = false;
  //                 }
  //                 if (find.children && find.children.length > 0) {
  //                     result = true;
  //                 }
  //             }
  //         }
  //     })
  // }
  // return result;
}