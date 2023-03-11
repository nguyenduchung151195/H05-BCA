/*
 * FileManager Messages
 *
 * This contains all the text for the FileManager container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.FileManager';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the FileManager container!',
  },
});
export const language = {
  vn: {
    filemanager: {
      NewFolder: 'Thêm mới folder',
      Upload: 'Tải file',
      UploadFile: 'Tải file kèm cấu trúc',
      Delete: 'Xóa',
      Rename: 'Đổi tên',
      Download: 'Tải xuống',
      Cut: 'Cut',
      Copy: 'Sao chép',
      Paste: 'Dán',
      SortBy: 'Sắp xếp',
      Refresh: 'Làm mới',
      'Item-Selection': 'Lựa chọn',
      'Items-Selection': 'Lựa chọn nhiều',
      View: 'Hiển thị',
      Details: 'Chi tiết',
      SelectAll: 'Chọn tất cả',
      Open: 'Open',
      // 'Tooltip-NewFolder': 'Neuer Ordner',
      // 'Tooltip-Upload': 'Hochladen',
      // 'Tooltip-Delete': 'Löschen',
      // 'Tooltip-Rename': 'Umbenennen',
      // 'Tooltip-Download': 'Herunterladen',
      // 'Tooltip-Cut': 'Schnitt',
      // 'Tooltip-Copy': 'Kopieren',
      // 'Tooltip-Paste': 'Einfügen',
      // 'Tooltip-SortBy': 'Sortiere nach',
      // 'Tooltip-Refresh': 'Aktualisierung',
      // 'Tooltip-Selection': 'Auswahl aufheben',
      // 'Tooltip-View': 'Aussicht',
      // 'Tooltip-Details': 'Einzelheiten',
      // 'Tooltip-SelectAll': 'Wählen Sie Alle',
      Name: 'Tên',
      Size: 'Kích thước',
      DateModified: 'Cập nhật lần cuối',
      DateCreated: 'Ngày tạo',
      Path: 'Đường dẫn',
      // Modified: 'Thay đổi',
      // Created: 'Erstellt',
      // Location: 'Ort',
      Type: 'Loại',
      Permission: 'Quyền hạn',
      Ascending: 'Tăng dần',
      Descending: 'Giảm dần',
      'View-LargeIcons': 'Dạng Folder',
      'View-Details': 'Dạng List',
      Search: 'Tìm kiếm',
      'Button-Ok': 'Xác nhận',
      'Button-Cancel': 'Hủy',
      'Button-Yes': 'Có',
      'Button-No': 'Không',
      'Button-Create': 'Tạo mới',
      'Button-Save': 'Lưu',
      'Header-NewFolder': 'Tạo mới thư mục',
      'Content-NewFolder': 'Tên thư mục',
      'Header-Rename': 'Đổi tên file / thư mục',
      'Content-Rename': 'Tên file/ thư mục ',
      'Header-Rename-Confirmation': 'Xác nhận đổi tên',
      'Content-Rename-Confirmation': 'Đồng chí có muốn đổi định dạng file?',
      'Header-Delete': 'Xóa file/thư mục ',
      'Content-Delete': 'Đồng chí có chắc muốn xóa file / thư mục?',
      'Header-Multiple-Delete': 'Xóa nhiều file / thư mục',
      'Content-Multiple-Delete': 'Đồng chí muốn xóa {0} file / thư mục?',
      'Header-Duplicate': 'File / thư mục đã tồn tại',
      'Content-Duplicate': 'Tên file / thư mục đã tồn tại?',
      'Header-Upload': 'Tải file lên',
      Error: 'Lỗi',
      'Validation-Empty': 'Tên thư mục không được để chống',
      'Validation-Invalid':
        'Tên file hoặc thư mục {0} chứa kí tự không hợp lệ. Vui lòng sử dụng tên khác. Tên file hoặc folder hợp lệ không kết thúc bằng dấu "." hoặc khoảng trống, và không bao gồm các kí tự: /:*?”<>|',
      'Validation-NewFolder-Exists': 'File hoặc folder với tên {0} đã tồn tại.',
      'Validation-Rename-Exists': 'Không thể đổi tên {0} thành {1}',
      'Folder-Empty': 'Thư mục trống',
      'File-Upload': 'Kéo file vào để tải lên',
      'Search-Empty': 'Không tìm thấy file / thư mục',
      'Search-Key': 'Thử với từ khóa khác',
      'Sub-Folder-Error': 'Đường dẫn ',
      'Access-Denied': 'Thao tác bị từ chối',
      'Access-Details': 'Đồng chí không có quyền thực hiện thao tác trên.',
      'Header-Retry': 'Thử lại',
      'Content-Retry': 'Vui lòng thử lại',
      'Button-Keep-Both': 'Giữ cả hai',
      'Button-Replace': 'Thay thế',
      'Button-Skip': 'Bỏ qua',
      'ApplyAll-Label': 'Áp dụng cho tất cả',
    },
  },
};

/*
 * TaskPage Messages
 *
 * This contains all the text for the TaskPage container.
 */

// import { defineMessages } from 'react-intl';
// import { getDataI18N } from '../../utils/common';
// const data = require('../../translations/vi/FileManage.json');
// export const scope = 'app.container.FileManage';

// export default defineMessages(getDataI18N(scope, data));
